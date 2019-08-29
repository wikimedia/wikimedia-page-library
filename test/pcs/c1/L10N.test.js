import assert from 'assert'
import { c1 } from '../../../build/wpl_pcs'
import domino from 'domino'

const L10N = c1.L10N

/* eslint-disable no-global-assign, no-native-reassign */

describe('pcs.c1.L10N', () => {
  describe('.localizeLabels()', () => {
    it('addTitleDescription', () => {
      document = domino.createDocument(
        '<p id="pagelib_edit_section_add_title_description">before</p>')

      L10N.localizeLabels({ addTitleDescription: 'addTitleDescription' })
      assert.strictEqual(document.body.querySelector('p').innerHTML, 'addTitleDescription')
    })
    it('tableInfobox', () => {
      document = domino.createDocument(
        '<strong class="pagelib_table_infobox">Quick facts</strong>')

      L10N.localizeLabels({ tableInfobox: 'tableInfobox' })
      assert.strictEqual(document.body.querySelector('strong').innerHTML, 'tableInfobox')
    })
    it('tableOther', () => {
      document = domino.createDocument(
        '<strong class="pagelib_table_other">More information</strong>')

      L10N.localizeLabels({ tableOther: 'tableOther' })
      assert.strictEqual(document.body.querySelector('strong').innerHTML, 'tableOther')
    })
    it('tableClose', () => {
      document = domino.createDocument(
        '<div class="pagelib_collapse_table_collapsed_bottom">Close</div>')

      L10N.localizeLabels({ tableClose: 'tableClose' })
      assert.strictEqual(document.body.querySelector('div').innerHTML, 'tableClose')
    })
  })
})