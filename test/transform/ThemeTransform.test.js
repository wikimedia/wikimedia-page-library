import assert from 'assert'
import domino from 'domino'
import pagelib from '../../build/wikimedia-page-library-transform'

describe('ThemeTransform', () => {
  describe('.setTheme()', () => {
    it('set', () => {
      const document = domino.createDocument()
      const light = pagelib.ThemeTransform.THEME.DEFAULT
      pagelib.ThemeTransform.setTheme(document, light)
      assert.ok(document.querySelector('html').classList.contains(light))
    })

    it('replace', () => {
      const document = domino.createDocument()

      const light = pagelib.ThemeTransform.THEME.DEFAULT
      pagelib.ThemeTransform.setTheme(document, light)

      const dark = pagelib.ThemeTransform.THEME.DARK
      pagelib.ThemeTransform.setTheme(document, pagelib.ThemeTransform.THEME.DARK)

      assert.ok(!document.querySelector('html').classList.contains(light))
      assert.ok(document.querySelector('html').classList.contains(dark))
    })
  })

  describe('.classifyElements()', () => {
    it('background', () => {
      const document = domino.createDocument('<img style="background: red" src=/>')
      pagelib.ThemeTransform.classifyElements(document.documentElement)

      const clazz = pagelib.ThemeTransform.CONSTRAINT.IMAGE_NO_BACKGROUND
      assert.ok(!document.querySelector('img').classList.contains(clazz))
    })

    it('parent background', () => {
      const document = domino.createDocument('<div style="background: red"><img src=/></div>')
      pagelib.ThemeTransform.classifyElements(document.documentElement)

      const clazz = pagelib.ThemeTransform.CONSTRAINT.IMAGE_NO_BACKGROUND
      assert.ok(!document.querySelector('img').classList.contains(clazz))
    })

    it('no background', () => {
      const document = domino.createDocument('<img src=/>')
      pagelib.ThemeTransform.classifyElements(document.documentElement)

      const clazz = pagelib.ThemeTransform.CONSTRAINT.IMAGE_NO_BACKGROUND
      assert.ok(document.querySelector('img').classList.contains(clazz))
    })

    it('tabular', () => {
      const document = domino.createDocument('<table><tr><td><img src=/></td></tr></table>')
      pagelib.ThemeTransform.classifyElements(document.documentElement)

      const clazz = pagelib.ThemeTransform.CONSTRAINT.IMAGE_NONTABULAR
      assert.ok(!document.querySelector('img').classList.contains(clazz))
    })

    it('nontabular', () => {
      const document = domino.createDocument('<img src=/>')
      pagelib.ThemeTransform.classifyElements(document.documentElement)

      const clazz = pagelib.ThemeTransform.CONSTRAINT.IMAGE_NONTABULAR
      assert.ok(document.querySelector('img').classList.contains(clazz))
    })
  })
})