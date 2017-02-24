// todo: fix import path
const assert = require('assert')
const CollapseElement = require('../src/CollapseElement')
const domino = require('domino')

describe('CollapseElement', () => {
  describe('getTableHeader()', () => {
    const getTableHeader = CollapseElement.getTableHeader

    it('no table', () => {
      const doc = domino.createDocument('<html></html>')
      const actual = getTableHeader(doc.documentElement)
      assert.deepEqual([], actual)
    })

    it('no header', () => {
      const doc = domino.createDocument('<table></table>')
      const actual = getTableHeader(doc.querySelector('table'))
      assert.deepEqual([], actual)
    })

    it('empty header', () => {
      const doc = domino.createDocument('<table><tr><th></th></tr></table>')
      const actual = getTableHeader(doc.querySelector('table'))
      assert.deepEqual([], actual)
    })

    it('nonempty header', () => {
      const doc = domino.createDocument('<table><tr><th><a>text</a></th></tr></table>')
      const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
      assert.deepEqual(['text'], actual)
    })
  })
})