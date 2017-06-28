import { LazyLoadTransform } from '../../build/wikimedia-page-library-transform'
import assert from 'assert'
import domino from 'domino'

describe('LazyLoadTransform', () => {
  describe('.transformImage()', () => {
    const transformImage = LazyLoadTransform.test.transformImage

    describe('when an image is transformed', function Test() {
      beforeEach(() => {
        const html = `<img class=classes style=styles width=1 height=2 src=/src srcset=/srcset
          alt=text>`
        this.document = domino.createDocument(html)
        this.image = this.document.querySelector('img')

        transformImage(this.document, this.image)

        this.placeholder = this.document.querySelector('.pagelib-lazy-load-placeholder')
      })

      it('the image is removed from the DOM', () => assert.ok(!this.document.querySelector('img')))
      it('the image is an orphan', () => assert.ok(!this.image.parentNode))
      describe('the image resource attributes have been removed:', () => {
        it('class', () => assert.ok(!this.image.hasAttribute('class')))
        it('style', () => assert.ok(!this.image.hasAttribute('style')))
        it('src', () => assert.ok(!this.image.hasAttribute('src')))
        it('srcset', () => assert.ok(!this.image.hasAttribute('srcset')))
      })

      it('the placeholder is added to the DOM', () => assert.ok(this.placeholder))

      it('the placeholder is a pending class member', () =>
        assert.ok(this.placeholder.classList.contains('pagelib-lazy-load-placeholder-pending')))
      it('the placeholder style width is set', () =>
        assert.ok(this.placeholder.getAttribute('style').includes('width: 1px;')))
      it('the placeholder style height is set', () =>
        assert.ok(this.placeholder.getAttribute('style').includes('height: 2px;')))

      describe('the other image attributes are preserved as data-* attributes:', () => {
        it('class', () => assert.ok(this.placeholder.getAttribute('data-class') === 'classes'))
        it('style', () => assert.ok(this.placeholder.getAttribute('data-style') === 'styles'))
        it('src', () => assert.ok(this.placeholder.getAttribute('data-src') === '/src'))
        it('srcset', () => assert.ok(this.placeholder.getAttribute('data-srcset') === '/srcset'))
        it('width', () => assert.ok(this.placeholder.getAttribute('data-width') === '1'))
        it('height', () => assert.ok(this.placeholder.getAttribute('data-height') === '2'))
        it('alt', () => assert.ok(this.placeholder.getAttribute('data-alt') === 'text'))
      })
    })
  })

  describe('.loadImage()', () => {
    const loadImage = LazyLoadTransform.test.loadImage

    describe('when a placeholder is loading', function Test() {
      beforeEach(() => {
        const html = `<span
          class='pagelib-lazy-load-placeholder pagelib-lazy-load-placeholder-pending'
          style='width: 1px; height: 2px;' data-class=classes data-style=styles data-src=/src
          data-srcset=/srcset data-width=1 data-height=2 data-alt=text>&nbsp;</span>`
        this.document = domino.createDocument(html)
        this.placeholder = this.document.querySelector('.pagelib-lazy-load-placeholder')

        this.image = loadImage(this.document, this.placeholder)
      })

      it('the placeholder is not a pending class member', () =>
        assert.ok(!this.placeholder.classList.contains('pagelib-lazy-load-placeholder-pending')))
      it('the placeholder is a loading class member', () =>
        assert.ok(this.placeholder.classList.contains('pagelib-lazy-load-placeholder-loading')))

      it('the image is an orphan', () => assert.ok(!this.image.parentNode))

      describe('the image attributes are restored:', () => {
        it('class', () => assert.ok(this.image.getAttribute('class') === 'classes'))
        it('style', () => assert.ok(this.image.getAttribute('style') === 'styles'))
        it('src', () => assert.ok(this.image.getAttribute('src') === '/src'))
        it('srcset', () => assert.ok(this.image.getAttribute('srcset') === '/srcset'))
        it('width', () => assert.ok(this.image.getAttribute('width') === '1'))
        it('height', () => assert.ok(this.image.getAttribute('height') === '2'))
        it('alt', () => assert.ok(this.image.getAttribute('alt') === 'text'))
      })

      describe('and the placeholder is loaded', () => {
        beforeEach(() => this.image.dispatchEvent(new domino.impl.Event('load')))

        it('the placeholder is not a loading class member', () =>
          assert.ok(!this.placeholder.classList.contains('pagelib-lazy-load-placeholder-loading')))
        it('the placeholder is a loaded class member', () =>
          assert.ok(this.placeholder.classList.contains('pagelib-lazy-load-placeholder-loaded')))

        it('the image is a child of the placeholder', () =>
          assert.ok(this.image.parentNode === this.placeholder))
      })
    })
  })

  describe('.transform()', () => {
    describe('when images are transformed', function Test() {
      beforeEach(() => {
        this.document = domino.createDocument('<div><img src=/><img src=/></div>')
        const images = LazyLoadTransform.queryTransformImages(this.document.documentElement)
        LazyLoadTransform.transform(this.document, images)
      })

      it('the images are removed from the DOM', () =>
        assert.ok(!this.document.querySelector('img')))
      it('placeholders are added to the DOM', () =>
        assert.ok(this.document.querySelectorAll('.pagelib-lazy-load-placeholder').length === 2))
    })
  })

  describe('.loadImages()', () => {
    describe('when images are loaded', function Test() {
      beforeEach(() => {
        const html = `
          <div>
            <span class='pagelib-lazy-load-placeholder pagelib-lazy-load-placeholder-pending'
              data-src=/src>&nbsp;</span>
            <span class='pagelib-lazy-load-placeholder pagelib-lazy-load-placeholder-pending'
              data-src=/src>&nbsp;</span>
          </div>`
        this.document = domino.createDocument(html)
        const placeholders = LazyLoadTransform.queryPlaceholders(this.document.documentElement)
        LazyLoadTransform.loadImages(this.document, placeholders)
      })

      it('the placeholder loading class is set', () => {
        // eslint-disable-next-line max-len
        const placeholders = this.document.querySelectorAll('.pagelib-lazy-load-placeholder-loading')
        assert.ok(placeholders.length === 2)
      })
    })
  })
})