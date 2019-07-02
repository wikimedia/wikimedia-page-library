import assert from 'assert'
import { c1 } from '../../../build/wikimedia-page-library-pcs'
import domino from 'domino'

const L10N = c1.L10N

describe('pcs.c1.L10N', () => {
  describe('.localizeLabels()', () => {
    it('addTitleDescription', () => {
      const window = domino.createWindow(
        '<p id="pagelib_edit_section_add_title_description">before</p>')
      const document = window.document

      L10N.localizeLabels(document, { addTitleDescription: 'after' })
      assert.strictEqual(document.body.querySelector('p').innerHTML, 'after')
    })
  })
})