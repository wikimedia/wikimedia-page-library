import assert from 'assert'
import domino from 'domino'
import transforms from '../../build/wikimedia-page-library-transform'

describe('LazyLoadTransform', () => {
  const transform = transforms.test.LazyLoadTransform

  // Add expected browser Element types to environment.
  global.HTMLImageElement = domino.impl.HTMLImageElement
  global.HTMLVideoElement = domino.impl.HTMLVideoElement

  describe('transformAttributes()', () => {
    const transformAttributes = transform.test.transformAttributes

    describe('when the attribute to transform is not present', () => {
      const element = domino.createDocument('<a href=/>link</a>').querySelector('a')

      /** @type {PlaceholderTagAttributes} */
      const attributes = { id: 'a' }

      transformAttributes(element, attributes)

      it('the placeholder attribute is set', () => assert.ok(element.id === 'a'))
      it('the data-* attribute is not set', () => assert.ok(!element.hasAttribute('data-id')))
      it('the other attributes are unmodified', () => assert.ok(element.href === '/'))
      it('the contents are unmodified', () => assert.ok(element.innerHTML === 'link'))
    })

    describe('when the attribute to transform is present', () => {
      const element = domino.createDocument('<a id=a href=/a>link</a>').querySelector('a')

      /** @type {PlaceholderTagAttributes} */
      const attributes = { href: '/b' }

      transformAttributes(element, attributes)

      it('the placeholder attribute is set', () => assert.ok(element.href === '/b'))
      it('the data-* attribute is set', () => assert.ok(element.getAttribute('data-href') === '/a'))
      it('the other attributes are unmodified', () => assert.ok(element.id === 'a'))
      it('the contents are unmodified', () => assert.ok(element.innerHTML === 'link'))
    })

    describe('when multiple attributes are specified', () => {
      const element = domino.createDocument('<a id=a href=/a>link</a>').querySelector('a')

      /** @type {PlaceholderTagAttributes} */
      const attributes = { className: 'class', href: '/b' }

      transformAttributes(element, attributes)

      it('the placeholder attributes are set', () => {
        assert.ok(element.getAttribute('className') === 'class')
        assert.ok(element.href === '/b')
      })
      it('the data-* attributes are set only for replaced attributes', () => {
        assert.ok(!element.hasAttribute('data-className'))
        assert.ok(element.getAttribute('data-href') === '/a')
        assert.ok(!element.hasAttribute('data-id'))
      })
      it('the other attributes are unmodified', () => assert.ok(element.id === 'a'))
      it('the contents are unmodified', () => assert.ok(element.innerHTML === 'link'))
    })

    // This is a corner case that is never expected to be encountered. In this scenario, the
    // attribute to be replaced overwrites a preexisting data-* attribute making the inversion
    // unfortunately lossy.
    describe('when the attribute and data-attribute to transform are present', () => {
      const element = domino.createDocument('<a id=a data-id=b href=/>link</a>').querySelector('a')

      /** @type {PlaceholderTagAttributes} */
      const attributes = { id: 'c' }

      transformAttributes(element, attributes)

      it('the placeholder attribute is set', () => assert.ok(element.id === 'c'))
      it('the data-* attribute is set and the previous value is irreversibly lost', () =>
        assert.ok(element.getAttribute('data-id') === 'a'))
      it('the other attributes are unmodified', () => assert.ok(element.href === '/'))
      it('the contents are unmodified', () => assert.ok(element.innerHTML === 'link'))
    })
  })

  describe('invertAttributes()', () => {
    const invertAttributes = transform.test.invertAttributes

    describe('when the data-* attribute to restore is not present', () => {
      const element = domino.createDocument('<a id=a href=/>link</a>').querySelector('a')

      /** @type {PlaceholderTagAttributes} */
      const attributes = { id: '' }

      invertAttributes(element, attributes)

      it('the placeholder attribute is removed', () => assert.ok(!element.hasAttribute('id')))
      it('the data-* attribute is removed', () => assert.ok(!element.hasAttribute('data-id')))
      it('the other attributes are unmodified', () => assert.ok(element.href === '/'))
      it('the contents are unmodified', () => assert.ok(element.innerHTML === 'link'))
    })

    describe('when the data-* attribute to restore is present', () => {
      const element = domino.createDocument('<a id=a data-id=b href=/>link</a>').querySelector('a')

      /** @type {PlaceholderTagAttributes} */
      const attributes = { id: '' }

      invertAttributes(element, attributes)

      it('the attribute is restored', () => assert.ok(element.id === 'b'))
      it('the data-* attribute is removed', () => assert.ok(!element.hasAttribute('data-id')))
      it('the other attributes are unmodified', () => assert.ok(element.href === '/'))
      it('the contents are unmodified', () => assert.ok(element.innerHTML === 'link'))
    })

    describe('when the attributes are transformed and inverted', () => {
      const element = domino.createDocument('<a id=a href=/a>link</a>').querySelector('a')
      const html = element.outerHTML

      /** @type {PlaceholderTagAttributes} */
      const attributes = { className: 'class', href: '/b' }

      transform.test.transformAttributes(element, attributes)
      invertAttributes(element, attributes)

      it('the result is lossless', () => assert.ok(element.outerHTML === html))
    })
  })

  describe('transformElement()', () => {
    const transformElement = transform.test.transformElement

    describe('when an image is transformed', () => {
      const element = domino.createDocument('<img class=a src=/>').querySelector('img')

      transformElement(element)

      it('the classList is replaced', () => {
        assert.ok(element.classList.length === 1)
        assert.ok(element.classList.contains('pagelib-lazy-load-image-placeholder'))
      })

      it('the src is replaced', () => assert.ok(element.src.startsWith('data:')))
      it('the srcset is replaced', () =>
        assert.ok(element.getAttribute('srcset').startsWith('data:')))
    })

    describe('when a video is transformed', () => {
      const element = domino.createDocument('<video class=a src=/></video>').querySelector('video')

      transformElement(element)

      it('the classList is replaced', () => {
        assert.ok(element.classList.length === 1)
        assert.ok(element.classList.contains('pagelib-lazy-load-video-placeholder'))
      })
      it('the poster is replaced', () =>
        assert.ok(element.getAttribute('poster').startsWith('data:')))
    })

    describe('when an unsupported element is transformed', () => {
      const element = domino.createDocument('<a class=a href=/></a>').querySelector('a')
      const html = element.outerHTML

      transformElement(element)

      it('the element is unmodified', () => assert.ok(element.outerHTML === html))
    })
  })

  describe('invertElement()', () => {
    const invertElement = transform.test.invertElement

    describe('when an image placeholder is inverted', () => {
      const html = `<img class=pagelib-lazy-load-image-placeholder data-class='a b' src=data:
        data-src=/ srcset=data:>`
      const element = domino.createDocument(html).querySelector('img')

      invertElement(element)

      it('the classList is restored', () => {
        assert.ok(element.classList.length === 2)
        assert.ok(element.classList.contains('a'))
        assert.ok(element.classList.contains('b'))
      })
      it('the src is restored', () => assert.ok(element.src === '/'))
      it('the srcset is restored', () => assert.ok(!element.hasAttribute('srcset')))
      it('the data-* attributes are removed', () => {
        assert.ok(!element.hasAttribute('data-class'))
        assert.ok(!element.hasAttribute('data-src'))
      })
    })

    describe('when a video placeholder is inverted', () => {
      const html = `<video class=pagelib-lazy-load-video-placeholder poster=data:
        data-poster=/ src=/></video>`
      const element = domino.createDocument(html).querySelector('video')

      invertElement(element)

      it('the classList is restored', () => assert.ok(element.classList.length === 0))
      it('the poster is restored', () => assert.ok(element.getAttribute('poster') === '/'))
    })

    describe('when an unsupported element is inverted', () => {
      const element = domino.createDocument('<a class=a href=/></a>').querySelector('a')
      const html = element.outerHTML

      invertElement(element)

      it('the element is unmodified', () => assert.ok(element.outerHTML === html))
    })

    describe('when an element is transformed and inverted', () => {
      const element = domino.createDocument('<img class=a src=/>').querySelector('img')
      const html = element.outerHTML

      transform.test.transformElement(element)
      invertElement(element)

      it('the result is lossless', () => assert.ok(element.outerHTML === html))
    })
  })

  describe('transform()', () => {
    describe('when an element is transformed', () => {
      const element = domino.createDocument('<img src=/>').querySelector('img')

      transform.transform(element)

      it('the element is transformed', () =>
        assert.ok(element.classList.contains('pagelib-lazy-load-image-placeholder')))
    })

    describe('when a tree is transformed', () => {
      const html = '<a href=/><video src=/></video></a><img src=/><a href=/></a>'
      const element = domino.createDocument(html).documentElement

      transform.transform(element)

      it('the unsupported elements are unmodified', () => {
        const elements = Array.from(element.querySelectorAll('a'))
        assert.ok(elements.every(element => element.classList.length === 0))
      })
      it('the supported elements are transformed', () => {
        const elements = Array.from(element.querySelectorAll('[class^=pagelib-]'))
        assert.ok(elements.length === 2)
        assert.ok(elements.every(element => element.classList.length === 1))
      })
    })

    describe('when a transformed tree is transformed', () => {
      let html = `<img class=pagelib-lazy-load-image-placeholder src=data: data-src=/ srcset=data:
        data-srcset=/>`
      const element = domino.createDocument(html).documentElement
      html = element.outerHTML

      transform.transform(element)

      it('the tree is unmodified', () => assert.ok(element.outerHTML === html))
    })

    describe('when a tree with no supported elements is transformed', () => {
      const element = domino.createDocument('<html></html>').documentElement
      const html = element.outerHTML

      transform.transform(element)

      it('the tree is unmodified', () => assert.ok(element.outerHTML === html))
    })
  })

  describe('invert()', () => {
    describe('when an element is inverted', () => {
      const html = `
        <img class=pagelib-lazy-load-image-placeholder src=data: data-src=/ srcset=data:>`
      const element = domino.createDocument(html).querySelector('img')

      transform.invert(element)

      it('the transform is undone', () => assert.ok(!element.classList.length))
    })

    describe('when a tree is inverted', () => {
      const html = `
        <a href=/><video class=pagelib-lazy-load-video-placeholder src=/ poster=data:></video></a>
        <img class=pagelib-lazy-load-image-placeholder src=data: data-src=/ srcset=data:>
        <a href=/></a>`
      const element = domino.createDocument(html).documentElement

      transform.invert(element)

      it('all transforms are undone', () => {
        const elements = Array.from(element.querySelectorAll('[class^=pagelib-]'))
        assert.ok(elements.length === 0)
      })
    })

    describe('when an inverted tree is inverted', () => {
      const element = domino.createDocument('<img src=/>').documentElement
      const html = element.outerHTML

      transform.invert(element)

      it('the tree is unmodified', () => assert.ok(element.outerHTML === html))
    })

    describe('when a tree with no supported elements is inverted', () => {
      const element = domino.createDocument('<html></html>').documentElement
      const html = element.outerHTML

      transform.invert(element)

      it('the tree is unmodified', () => assert.ok(element.outerHTML === html))
    })

    describe('when a tree is transformed and inverted', () => {
      const element = domino.createDocument('<img class=a src=/>').documentElement
      const html = element.outerHTML

      transform.transform(element)
      transform.invert(element)

      it('the result is lossless', () => assert.ok(element.outerHTML === html))
    })
  })
})