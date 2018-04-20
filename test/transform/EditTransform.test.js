import assert from 'assert'
import fixtureIO from '../utilities/FixtureIO'
import pagelib from '../../build/wikimedia-page-library-transform'
const editTransform = pagelib.EditTransform
let document
let element

describe('EditTransform', () => {
  beforeEach(() => {
    document = fixtureIO.documentFromFixtureFile('EditTransform.html')
    element = editTransform.newEditSectionHeader(document, 0, 2, 'Title')
  })
  describe('.newEditSectionHeader()', () => {
    it('returns a non null element', () => {
      assert.notEqual(element, null)
    })
    it('creates h2 element', () => {
      assert.ok(element.childNodes.item(0).nodeName === 'H2')
    })
    it('has all required attributes', () => {
      assert.ok(element.childNodes.item(0).hasAttribute('data-id'))
    })
    it('has child nodes', () => {
      assert.ok(element.childNodes.item(0).hasChildNodes)
    })
    it('has edit container and pencil', () => {
      assert.ok(element.innerHTML.includes('pagelib_edit_section_link'))
      assert.ok(element.innerHTML.includes('pagelib_edit_section_link_container'))
    })
    it('has desired title', () => {
      const text = element.childNodes.item(0).textContent
      assert.ok(text.includes('Title'))
    })
  })
})
describe('EditTransform', () => {
  beforeEach(() => {
    document = fixtureIO.documentFromFixtureFile('EditTransform.html')
    element = editTransform.newEditSectionHeader(document, 0, 3, 'Title')
  })
  describe('.newEditSectionHeader()', () => {
    it('creates h3 element', () => {
      assert.ok(element.childNodes.item(0).nodeName === 'H3')
    })
  })
})
describe('EditTransform', () => {
  beforeEach(() => {
    document = fixtureIO.documentFromFixtureFile('EditTransform.html')
    element = editTransform.newEditSectionHeader(document, 0, 4, 'Title')
  })
  describe('.newEditSectionHeader()', () => {
    it('creates h4 element', () => {
      assert.ok(element.childNodes.item(0).nodeName === 'H4')
    })
  })
})