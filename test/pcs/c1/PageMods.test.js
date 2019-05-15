import assert from 'assert'
import { c1 } from '../../../build/wikimedia-page-library-pcs'
import domino from 'domino'

const PageMod = c1.PageMods
const Themes = c1.Themes

describe('pcs.c1.PageMod', () => {
  const emptyHTML = '<html lang="en"><head><title>Foo</title></head><body><p></p></body></html>'

  describe('.onPageLoad()', () => {
    it('any', () => {
      const document = domino.createDocument(emptyHTML)

      PageMod.onPageLoad(window, document)
    })
  })

  describe('.setMulti()', () => {
    it('all', () => {
      let onSuccessCallbackCalled = false
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      PageMod.setMulti(document, {
        theme: Themes.DARK,
        dimImages: true,
        margins: { top: '1px', right: '2px', bottom: '3px', left: '4px' },
        areTablesCollapsed: true
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

      PageMod.setMulti(window, document, {})

      assert.strictEqual(document.outerHTML, emptyHTML)
    })
  })

  describe('.setTheme()', () => {
    it('sepia', () => {
      let callbackCalled = false
      const document = domino.createDocument(emptyHTML)

      PageMod.setTheme(document, Themes.SEPIA, () => { callbackCalled = true })

      assert.ok(document.documentElement.classList.contains('pagelib_theme_sepia'))
      assert.ok(callbackCalled)
    })
  })

  describe('.setDimImages()', () => {
    it('true + callback', () => {
      let callbackCalled = false
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      PageMod.setDimImages(document, true, () => { callbackCalled = true })

      assert.ok(document.documentElement.classList.contains('pagelib_dim_images'))
      assert.ok(callbackCalled)
    })

    it('false', () => {
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      PageMod.setDimImages(document, false)

      assert.ok(!document.documentElement.classList.contains('pagelib_dim_images'))
    })
  })

  describe('.setMargins()', () => {
    it('all', () => {
      let callbackCalled = false
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      PageMod.setMargins(document, { top: '1px', right: '2px', bottom: '3px', left: '4px' },
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

      PageMod.setMargins(document, {})

      assert.strictEqual(document.body.style.marginTop,'')
      assert.strictEqual(document.body.style.marginRight,'')
      assert.strictEqual(document.body.style.marginBottom,'')
      assert.strictEqual(document.body.style.marginLeft,'')
    })
  })

  describe('.setDecorOffset()', () => {
    it('all', () => {
      let callbackCalled = false
      const window = domino.createWindow(emptyHTML)
      const document = window.document

      PageMod.setDecorOffset(document, 64,
        () => { callbackCalled = true })

      assert.strictEqual(PageMod.testing.getDecorOffsetObject().testing.getValue(),64)
      assert.ok(callbackCalled)
    })
  })
})