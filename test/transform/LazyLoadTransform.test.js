import { LazyLoadTransform } from '../../build/wikimedia-page-library-transform'
import assert from 'assert'
import domino from 'domino'

describe('LazyLoadTransform', () => {
  describe('.queryLazyLoadableImages()', () => {
    describe('images missing one or both dimensions should be returned:', () => {
      it('dimensionless', () => {
        const document = domino.createDocument('<img src=/>')
        const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
        assert.ok(images.length)
      })

      it('no width', () => {
        const document = domino.createDocument('<img height=100 src=/>')
        const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
        assert.ok(images.length)
      })

      it('no height', () => {
        const document = domino.createDocument('<img width=100 src=/>')
        const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
        assert.ok(images.length)
      })
    })

    describe('images with dimension attributes should be considered:', () => {
      describe('images with a small side should not be returned:', () => {
        it('width', () => {
          const document = domino.createDocument('<img width=1 height=100 src=/>')
          const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
          assert.ok(!images.length)
        })

        it('height', () => {
          const document = domino.createDocument('<img width=100 height=1 src=/>')
          const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
          assert.ok(!images.length)
        })
      })

      it('large images should be returned', () => {
        const document = domino.createDocument('<img width=100 height=100 src=/>')
        const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
        assert.ok(images.length)
      })

      describe('images with dimension styles should be considered first:', () => {
        describe('images with a small side should not be returned:', () => {
          it('width', () => {
            const html = '<img style="width: 1px" width=100 height=100 src=/>'
            const document = domino.createDocument(html)
            const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
            assert.ok(!images.length)
          })

          it('height', () => {
            const html = '<img style="height: 1px" width=100 height=100 src=/>'
            const document = domino.createDocument(html)
            const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
            assert.ok(!images.length)
          })
        })

        it('large images should be returned', () => {
          const html = '<img style="width: 100px; height: 100px" width=1 height=1 src=/>'
          const document = domino.createDocument(html)
          const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
          assert.ok(images.length)
        })
      })
    })

    describe('images with dimension styles should support the following units:', () => {
      for (const unit of ['px', 'ex', 'em']) {
        describe(unit, () => {
          it('small', () => {
            const html = `<img style="width: 1${unit}; height: 1${unit}" src=/>`
            const document = domino.createDocument(html)
            const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
            assert.ok(!images.length)
          })

          it('large', () => {
            const html = `<img style="width: 100${unit}; height: 100${unit}" src=/>`
            const document = domino.createDocument(html)
            const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
            assert.ok(images.length)
          })
        })
      }

      it('unknown', () => {
        const html = '<img style="width: 1mm; height: 1mm" src=/>'
        const document = domino.createDocument(html)
        const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
        assert.ok(!images.length)
      })
    })
  })

  describe('.convertImagesToPlaceholders()', () => {
    describe('when an image is converted', () => {
      describe('and dimensions are unspecified', function Test() {
        beforeEach(() => {
          const document = domino.createDocument('<img class=classes src=/src srcset=/srcset>')
          const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
          this.image = images[0]

          LazyLoadTransform.convertImagesToPlaceholders(document, images)
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
          const document = domino.createDocument('<img src=/ width=100 height=200>')
          const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
          this.image = images[0]

          LazyLoadTransform.convertImagesToPlaceholders(document, images)
        })

        it('the width is set', () =>
          assert.ok(this.image.style.getPropertyValue('width') === '100px'))
        it('the height is set', () =>
          assert.ok(this.image.style.getPropertyValue('height') === '200px'))
        it('the height has important priority', () =>
          assert.ok(this.image.style.getPropertyPriority('height') === 'important'))
      })

      describe('and dimensions are specified as a style', function Test() {
        beforeEach(() => {
          const html = `
            <img style="background: red; width: 300em !important; height: 400em !important"
              width=100 height=200 src=/>`
          const document = domino.createDocument(html)
          const images = LazyLoadTransform.queryLazyLoadableImages(document.documentElement)
          this.image = images[0]

          LazyLoadTransform.convertImagesToPlaceholders(document, images)
        })

        it('the width value is preserved as a data-* attribute', () =>
          assert.ok(this.image.getAttribute('data-width-value') === '300em'))
        it('the height value is preserved as a data-* attribute', () =>
          assert.ok(this.image.getAttribute('data-height-value') === '400em'))
        it('the width priority is preserved as a data-* attribute', () =>
          assert.ok(this.image.getAttribute('data-width-priority') === 'important'))
        it('the height priority is preserved as a data-* attribute', () =>
          assert.ok(this.image.getAttribute('data-height-priority') === 'important'))
        it('the other styles are unmodified', () =>
          assert.ok(this.image.style.background === 'red'))

        it('the width is set', () =>
          assert.ok(this.image.style.getPropertyValue('width') === '300em'))
        it('the height is set', () =>
          assert.ok(this.image.style.getPropertyValue('height') === '400em'))
        it('the height has important priority', () =>
          assert.ok(this.image.style.getPropertyPriority('height') === 'important'))
      })
    })
  })

  describe('.loadImage()', () => {
    describe('when an image is loading', function Test() {
      beforeEach(() => {
        const html = `<img class='classes pagelib-lazy-load-image-pending'
          style='background: red; width: 300em; height 400em !important' src=data: width=100
          height=200 data-src=/src data-srcset=/srcset data-width-value=300em
          data-width-priority=important data-height-value=400em data-height-priority=>`
        const document = domino.createDocument(html)
        this.image = document.querySelector('img')
        this.download = LazyLoadTransform.loadImage(document, this.image)
      })

      it('the src is set', () => assert.ok(this.download.getAttribute('src') === '/src'))
      it('the srcset is set', () => assert.ok(this.download.getAttribute('srcset') === '/srcset'))

      describe('and completes loading', () => {
        beforeEach(() => {
          this.download.dispatchEvent(new domino.impl.Event('load'))
          this.image.dispatchEvent(new domino.impl.Event('load'))
        })

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
          assert.ok(this.image.style.getPropertyValue('width') === '300em'))
        it('the width priority is restored', () =>
          assert.ok(this.image.style.getPropertyPriority('width') === 'important'))
        it('the height value is restored', () =>
          assert.ok(this.image.style.getPropertyValue('height') === '400em'))
        it('the height priority is restored', () =>
          assert.ok(!this.image.style.getPropertyPriority('height')))
        it('the other styles are unmodified', () =>
          assert.ok(this.image.style.background === 'red'))
      })
    })
  })
})