import assert from 'assert'
import domino from 'domino'
import pagelib from '../../build/wikimedia-page-library-transform'

describe('PlatformTransform', () => {
  describe('.classify()', () => {
    const testUserAgent = userAgent => { // eslint-disable-line require-jsdoc
      const window = domino.createWindow()
      Object.defineProperty(window, 'navigator', { value: { userAgent } })

      pagelib.PlatformTransform.classify(window)

      const classes = window.document.querySelector('html').classList
      return classes
    }

    it('unknown', () => {
      // eslint-disable-next-line max-len
      const classes = testUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/59.0.3071.109 Chrome/59.0.3071.109 Safari/537.36')
      assert.ok(!classes.length)
    })

    it('android', () => {
      // eslint-disable-next-line max-len
      const classes = testUserAgent('Mozilla/5.0 (Linux; Android 7.1.2; Pixel XL Build/NKG47L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/59.0.3071.125 Mobile Safari/537.36')
      assert.ok(classes.contains(pagelib.PlatformTransform.CLASS.ANDROID))
      assert.ok(classes.length === 1)
    })

    it('ios', () => {
      // eslint-disable-next-line max-len
      const classes = testUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Version/10.0 Mobile/14D27 Safari/602.1')
      assert.ok(classes.contains(pagelib.PlatformTransform.CLASS.IOS))
      assert.ok(classes.length === 1)
    })
  })
})