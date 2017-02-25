import applib from '../src'
import assert from 'assert'
import domino from 'domino'

describe('CollapseElement', () => {
  describe('getTableHeader()', () => {
    const getTableHeader = applib.CollapseElement.getTableHeader

    it('no table', () => {
      const doc = domino.createDocument('<html></html>')
      const actual = getTableHeader(doc.documentElement, 'pageTitle')
      assert.deepEqual(actual, [])
    })

    it('no header', () => {
      const doc = domino.createDocument('<table></table>')
      const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
      assert.deepEqual(actual, [])
    })

    it('empty header', () => {
      const doc = domino.createDocument('<table><tr><th></th></tr></table>')
      const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
      assert.deepEqual(actual, [])
    })

    it('nonempty header', () => {
      const doc = domino.createDocument('<table><tr><th><a>text</a></th></tr></table>')
      const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
      assert.deepEqual(actual, ['text'])
    })

    it('empty link', () => {
      const doc = domino.createDocument('<table><tr><th><a></a></th></tr></table>')
      const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
      assert.deepEqual(actual, [])
    })

    it('matching link', () => {
      const doc = domino.createDocument('<table><tr><th><a>pageTitle</a></th></tr></table>')
      const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
      assert.deepEqual(actual, [])
    })

    it('no page title', () => {
      const doc = domino.createDocument('<table><tr><th><a>text</a></th></tr></table>')
      const actual = getTableHeader(doc.querySelector('table'))
      assert.deepEqual(actual, [])
    })
  })
})