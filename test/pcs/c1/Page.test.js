import assert from 'assert'
import { c1 } from '../../../build/wikimedia-page-library-pcs'
import domino from 'domino'

const Page = c1.Page
const Platforms = c1.Platforms
const Themes = c1.Themes

/* eslint-disable no-global-assign, no-native-reassign */
describe('pcs.c1.Page', () => {
  const emptyHTML = '<html lang="en"><head><title>Foo</title></head><body><p></p></body></html>'

  describe('.onPageLoad()', () => {
    it('any', () => {
      window = domino.createWindow(emptyHTML)
      document = window.document

      Page.onPageLoad(window, document)
    })
  })

  describe('.setup()', () => {
    it('all', () => {
      let onSuccessCallbackCalled = false
      window = domino.createWindow(
        '<strong class="pagelib_table_infobox">Quick facts</strong>')
      document = window.document

      Page.setup({
        platform: Platforms.IOS,
        clientVersion: '6.2.1',
        l10n: {
          addTitleDescription: 'Titelbeschreibung bearbeiten',
          tableInfobox: 'Schnelle Fakten',
          tableOther: 'Weitere Informationen',
          tableClose: 'Schließen'
        },
        theme: Themes.DARK,
        dimImages: true,
        margins: { top: '1px', right: '2px', bottom: '3px', left: '4px' },
        areTablesInitiallyExpanded: true,
        textSizeAdjustmentPercentage: '100%',
        scrollTop: 64,
        loadImages: true
      }, () => { onSuccessCallbackCalled = true })

      assert.strictEqual(document.querySelector('.pagelib_table_infobox').innerHTML,
        'Schnelle Fakten')
      assert.ok(document.documentElement.classList.contains('pagelib_theme_dark'))
      assert.ok(document.documentElement.classList.contains('pagelib_dim_images'))
      assert.strictEqual(document.body.style.marginTop, '1px')
      assert.strictEqual(document.body.style.marginRight, '2px')
      assert.strictEqual(document.body.style.marginBottom, '3px')
      assert.strictEqual(document.body.style.marginLeft, '4px')
      assert.strictEqual(document.body.style['text-size-adjust'], '100%')
      assert.strictEqual(Page.testing.getScroller().testing.getScrollTop(), 64)
      assert.ok(onSuccessCallbackCalled)
    })

    it('empty settings', () => {
      window = domino.createWindow(emptyHTML)
      document = window.document

      Page.setup({})

      assert.strictEqual(document.outerHTML, emptyHTML)
    })

    it('nothing', () => {
      window = domino.createWindow(emptyHTML)
      document = window.document

      Page.setup()

      assert.strictEqual(document.outerHTML, emptyHTML)
    })
  })

  describe('.setTheme()', () => {
    it('sepia', () => {
      let callbackCalled = false
      document = domino.createDocument(emptyHTML)

      Page.setTheme(Themes.SEPIA, () => { callbackCalled = true })

      assert.ok(document.documentElement.classList.contains('pagelib_theme_sepia'))
      assert.ok(callbackCalled)
    })
  })

  describe('.setDimImages()', () => {
    it('true + callback', () => {
      let callbackCalled = false
      window = domino.createWindow(emptyHTML)
      document = window.document

      Page.setDimImages(true, () => { callbackCalled = true })

      assert.ok(document.documentElement.classList.contains('pagelib_dim_images'))
      assert.ok(callbackCalled)
    })

    it('false', () => {
      window = domino.createWindow(emptyHTML)
      document = window.document

      Page.setDimImages(false)

      assert.ok(!document.documentElement.classList.contains('pagelib_dim_images'))
    })
  })

  describe('.setMargins()', () => {
    it('all', () => {
      let callbackCalled = false
      window = domino.createWindow(emptyHTML)
      document = window.document

      Page.setMargins({ top: '1px', right: '2px', bottom: '3px', left: '4px' },
        () => { callbackCalled = true })

      assert.strictEqual(document.body.style.marginTop, '1px')
      assert.strictEqual(document.body.style.marginRight, '2px')
      assert.strictEqual(document.body.style.marginBottom, '3px')
      assert.strictEqual(document.body.style.marginLeft, '4px')
      assert.ok(callbackCalled)
    })

    it('nothing', () => {
      window = domino.createWindow(emptyHTML)
      document = window.document

      Page.setMargins({})

      assert.strictEqual(document.body.style.marginTop, '')
      assert.strictEqual(document.body.style.marginRight, '')
      assert.strictEqual(document.body.style.marginBottom, '')
      assert.strictEqual(document.body.style.marginLeft, '')
    })
  })

  describe('.setTextSizeAdjustmentPercentage()', () => {
    it('120%', () => {
      let callbackCalled = false
      window = domino.createWindow(emptyHTML)
      document = window.document

      Page.setTextSizeAdjustmentPercentage('120%',
        () => { callbackCalled = true })

      assert.strictEqual(document.body.style['text-size-adjust'], '120%')
      assert.ok(callbackCalled)
    })
  })

  describe('.setScrollTop()', () => {
    it('all', () => {
      let callbackCalled = false
      window = domino.createWindow(emptyHTML)
      document = window.document

      Page.setScrollTop(64,
        () => { callbackCalled = true })

      assert.strictEqual(Page.testing.getScroller().testing.getScrollTop(), 64)
      assert.ok(callbackCalled)
    })
  })

  describe('.getRevision()', () => {
    it('all', () => {
      window = domino.createWindow(
        '<html about="http://en.wikipedia.org/wiki/Special:Redirect/revision/907165344">')
      document = window.document

      assert.strictEqual(Page.getRevision(), '907165344')
    })
  })
})