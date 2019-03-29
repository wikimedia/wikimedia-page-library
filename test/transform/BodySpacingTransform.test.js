import { BodySpacingTransform } from '../../build/wikimedia-page-library-transform'
import assert from 'assert'
import domino from 'domino'

describe('BodySpacingTransform', () => {
  describe('.setMargins()', () => {
    it('no values', () => {
      const document = domino.createDocument('<p></p>')
      BodySpacingTransform.setMargins(document, {})
      assert.strictEqual(document.body.outerHTML, '<body><p></p></body>')
    })

    it('just width', () => {
      const document = domino.createDocument('<p></p>')
      BodySpacingTransform.setMargins(document, { right: '8px', left: '16px' })
      const style = 'margin-right: 8px; margin-left: 16px;'
      assert.strictEqual(document.body.outerHTML,`<body style="${style}"><p></p></body>`)
    })

    it('all', () => {
      const document = domino.createDocument('<p></p>')
      BodySpacingTransform.setMargins(document,
        { top: '1px', right: '2px', bottom: '3px', left: '4px' })
      const style = 'margin-top: 1px; margin-right: 2px; margin-bottom: 3px; margin-left: 4px;'
      assert.strictEqual(document.body.outerHTML, `<body style="${style}"><p></p></body>`)
    })
  })
  describe('.setPadding()', () => {
    it('no values', () => {
      const document = domino.createDocument('<p></p>')
      BodySpacingTransform.setPadding(document, {})
      assert.strictEqual(document.body.outerHTML, '<body><p></p></body>')
    })

    it('just width', () => {
      const document = domino.createDocument('<p></p>')
      BodySpacingTransform.setPadding(document, { right: '8px', left: '16px' })
      const style = 'padding-right: 8px; padding-left: 16px;'
      assert.strictEqual(document.body.outerHTML,`<body style="${style}"><p></p></body>`)
    })

    it('all', () => {
      const document = domino.createDocument('<p></p>')
      BodySpacingTransform.setPadding(document,
        { top: '1px', right: '2px', bottom: '3px', left: '4px' })
      const style = 'padding-top: 1px; padding-right: 2px; padding-bottom: 3px; padding-left: 4px;'
      assert.strictEqual(document.body.outerHTML,`<body style="${style}"><p></p></body>`)
    })
  })
})