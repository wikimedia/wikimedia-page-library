import { LazyLoadTransform } from '../../build/wikimedia-page-library-transform'
import assert from 'assert'
import domino from 'domino'

describe('LazyLoadTransform', () => {
  describe('.transform()', () => {
    describe('when an image is transformed', () => {
      describe('and dimensions are unspecified', function Test() {
        beforeEach(() => {
          const document = domino.createDocument('<img class=classes src=/src srcset=/srcset>')
          const images = LazyLoadTransform.queryTransformImages(document.documentElement)
          this.image = images[0]

          LazyLoadTransform.transform(document, images)
        })

        it('the src is preserved as a data-* attribute', () =>
          assert.ok(this.image.getAttribute('data-src') === '/src'))
        it('the srcset is preserved as a data-* attribute', () =>
          assert.ok(this.image.getAttribute('data-srcset') === '/srcset'))

        it('the src is replaced with placeholder content', () =>
          assert.ok(this.image.getAttribute('src').startsWith('data:')))
        it('the srcset is removed', () => assert.ok(!this.image.hasAttribute('srcset')))

        it('the image is a pending class member', () =>
          assert.ok(this.image.classList.contains('pagelib-lazy-load-image-pending')))
        it('the classes are otherwise unchanged', () => {
          assert.ok(this.image.classList.contains('classes'))
          assert.ok(this.image.classList.length === 2)
        })
      })

      describe('and dimensions are specified as attributes', function Test() {
        beforeEach(() => {
          const document = domino.createDocument('<img src=/ width=1 height=2>')
          const images = LazyLoadTransform.queryTransformImages(document.documentElement)
          this.image = images[0]

          LazyLoadTransform.transform(document, images)
        })

        it('the width is set', () =>
          assert.ok(this.image.style.getPropertyValue('width') === '1px'))
        it('the height is set', () =>
          assert.ok(this.image.style.getPropertyValue('height') === '2px'))
        it('the height has important priority', () =>
          assert.ok(this.image.style.getPropertyPriority('height') === 'important'))
      })

      describe('and dimensions are specified as a style', function Test() {
        beforeEach(() => {
          const html = `<img style="background: red; width: 3em !important; height: 4em !important"
            width=1 height=2 src=/>`
          const document = domino.createDocument(html)
          const images = LazyLoadTransform.queryTransformImages(document.documentElement)
          this.image = images[0]

          LazyLoadTransform.transform(document, images)
        })

        it('the width value is preserved as a data-* attribute', () =>
          assert.ok(this.image.getAttribute('data-width-value') === '3em'))
        it('the height value is preserved as a data-* attribute', () =>
          assert.ok(this.image.getAttribute('data-height-value') === '4em'))
        it('the width priority is preserved as a data-* attribute', () =>
          assert.ok(this.image.getAttribute('data-width-priority') === 'important'))
        it('the height priority is preserved as a data-* attribute', () =>
          assert.ok(this.image.getAttribute('data-height-priority') === 'important'))
        it('the other styles are unmodified', () =>
          assert.ok(this.image.style.background === 'red'))

        it('the width is set', () =>
          assert.ok(this.image.style.getPropertyValue('width') === '3em'))
        it('the height is set', () =>
          assert.ok(this.image.style.getPropertyValue('height') === '4em'))
        it('the height has important priority', () =>
          assert.ok(this.image.style.getPropertyPriority('height') === 'important'))
      })
    })
  })

  describe('.loadImage()', () => {
    describe('when an image is loading', function Test() {
      beforeEach(() => {
        const html = `<img class='classes pagelib-lazy-load-image-pending'
          style='background: red; width: 3em; height 4em !important' src=data: width=1 height=2
          data-src=/src data-srcset=/srcset data-width-value=3em data-width-priority=important
          data-height-value=4em data-height-priority=>`
        const document = domino.createDocument(html)
        this.image = document.querySelector('img')
        this.download = LazyLoadTransform.loadImage(document, this.image)
      })

      it('the src is set', () => assert.ok(this.download.getAttribute('src') === '/src'))
      it('the srcset is set', () => assert.ok(this.download.getAttribute('srcset') === '/srcset'))

      describe('and completes loading', () => {
        beforeEach(() => this.download.dispatchEvent(new domino.impl.Event('load')))

        it('the src is restored', () => assert.ok(this.image.getAttribute('src') === '/src'))
        it('the src data-* attribute is removed', () =>
          assert.ok(!this.image.hasAttribute('data-src')))
        it('the srcset is restored', () =>
          assert.ok(this.image.getAttribute('srcset') === '/srcset'))
        it('the srcset data-* attribute is removed', () =>
          assert.ok(!this.image.hasAttribute('data-srcset')))

        it('the pending class membership is replaced with loaded', () =>
          assert.ok(this.image.classList.contains('pagelib-lazy-load-image-loaded')))
        it('the classes are otherwise unchanged', () => {
          assert.ok(this.image.classList.contains('classes'))
          assert.ok(this.image.classList.length === 2)
        })

        it('the width value is restored', () =>
          assert.ok(this.image.style.getPropertyValue('width') === '3em'))
        it('the width value data-* attribute is removed', () =>
          assert.ok(!this.image.hasAttribute('data-width-value')))
        it('the width priority is restored', () =>
          assert.ok(this.image.style.getPropertyPriority('width') === 'important'))
        it('the width priority data-* attribute is removed', () =>
          assert.ok(!this.image.hasAttribute('data-width-priority')))
        it('the height value is restored', () =>
          assert.ok(this.image.style.getPropertyValue('height') === '4em'))
        it('the height value data-* attribute is removed', () =>
          assert.ok(!this.image.hasAttribute('data-height-value')))
        it('the height priority is restored', () =>
          assert.ok(!this.image.style.getPropertyPriority('height')))
        it('the height priority data-* attribute is removed', () =>
          assert.ok(!this.image.hasAttribute('data-height-priority')))
        it('the other styles are unmodified', () =>
          assert.ok(this.image.style.background === 'red'))
      })
    })
  })
})