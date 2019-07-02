import assert from 'assert'
import { c1 } from '../../../build/wikimedia-page-library-pcs'
import domino from 'domino'

const L10N = c1.L10N

describe('pcs.c1.L10n', () => {
  const addDescriptionHTML = '<a data-action="add_title_description">before</a>'

  describe('.localizeLabels()', () => {
    it('add_title_description', () => {
      const window = domino.createWindow(addDescriptionHTML)
      const document = window.document

      L10N.localizeLabels(document, { add_title_description: 'after' })
      assert.strictEqual(document.body.querySelector('a').innerHTML, 'after')
    })
  })
})