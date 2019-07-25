import assert from 'assert'
import { c1 } from '../../../build/wikimedia-page-library-pcs'
import domino from 'domino'

const Page = c1.Page
const Platforms = c1.Platforms
const Themes = c1.Themes

describe('pcs.c1.Page', () => {
  const emptyHTML = '<html lang="en"><head><title>Foo</title></head><body><p></p></body></html>'

  describe('.onPageLoad()', () => {
    it('any', () => {
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      Page.onPageLoad(window, document)
    })
  })

  describe('.setMulti()', () => {
    it('all', () => {
      let onSuccessCallbackCalled = false
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      Page.setup({
        platform: Platforms.IOS,
        clientVersion: '6.2.1',
        theme: Themes.DARK,
        dimImages: true,
        margins: { top: '1px', right: '2px', bottom: '3px', left: '4px' },
        areTablesInitiallyExpanded: true
      }, () => { onSuccessCallbackCalled = true })

      assert.ok(document.documentElement.classList.contains('pagelib_theme_dark'))
      assert.ok(document.documentElement.classList.contains('pagelib_dim_images'))
      assert.strictEqual(document.body.style.marginTop, '1px')
      assert.strictEqual(document.body.style.marginRight, '2px')
      assert.strictEqual(document.body.style.marginBottom, '3px')
      assert.strictEqual(document.body.style.marginLeft, '4px')
      assert.ok(onSuccessCallbackCalled)
    })

    it('nothing', () => {
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      Page.setMulti(window, document, {})

      assert.strictEqual(document.outerHTML, emptyHTML)
    })
  })

  describe('.setTheme()', () => {
    it('sepia', () => {
      let callbackCalled = false
      const document = domino.createDocument(emptyHTML)

      Page.setTheme(Themes.SEPIA, () => { callbackCalled = true })

      assert.ok(document.documentElement.classList.contains('pagelib_theme_sepia'))
      assert.ok(callbackCalled)
    })
  })

  describe('.setDimImages()', () => {
    it('true + callback', () => {
      let callbackCalled = false
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      Page.setDimImages(true, () => { callbackCalled = true })

      assert.ok(document.documentElement.classList.contains('pagelib_dim_images'))
      assert.ok(callbackCalled)
    })

    it('false', () => {
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      Page.setDimImages(false)

      assert.ok(!document.documentElement.classList.contains('pagelib_dim_images'))
    })
  })

  describe('.setMargins()', () => {
    it('all', () => {
      let callbackCalled = false
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      Page.setMargins({ top: '1px', right: '2px', bottom: '3px', left: '4px' },
        () => { callbackCalled = true })

      assert.strictEqual(document.body.style.marginTop,'1px')
      assert.strictEqual(document.body.style.marginRight,'2px')
      assert.strictEqual(document.body.style.marginBottom,'3px')
      assert.strictEqual(document.body.style.marginLeft,'4px')
      assert.ok(callbackCalled)
    })

    it('nothing', () => {
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      Page.setMargins({})

      assert.strictEqual(document.body.style.marginTop,'')
      assert.strictEqual(document.body.style.marginRight,'')
      assert.strictEqual(document.body.style.marginBottom,'')
      assert.strictEqual(document.body.style.marginLeft,'')
    })
  })

  describe('.setScrollTop()', () => {
    it('all', () => {
      let callbackCalled = false
      /* eslint no-unused-vars: ["off"] */
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      Page.setScrollTop(64,
        () => { callbackCalled = true })

      assert.strictEqual(Page.testing.getScroller().testing.getScrollTop(),64)
      assert.ok(callbackCalled)
    })
  })
})