import applib from '../build/applib'
import assert from 'assert'
import domino from 'domino'

describe('CollapseTable', () => {
  describe('getTableHeader()', () => {
    const getTableHeader = applib.CollapseTable.getTableHeader

    it('when no table, shouldn\'t find headers', () => {
      const doc = domino.createDocument('<html></html>')
      const actual = getTableHeader(doc.documentElement, 'pageTitle')
      assert.deepEqual(actual, [])
    })

    describe('when table', () => {
      it('and no header, shouldn\'t find headers', () => {
        const doc = domino.createDocument('<table></table>')
        const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
        assert.deepEqual(actual, [])
      })

      it('and header is empty, shouldn\'t find headers', () => {
        const doc = domino.createDocument('<table><tr><th></th></tr></table>')
        const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
        assert.deepEqual(actual, [])
      })

      describe('and header is nonempty', () => {
        it('and link is empty, shouldn\'t find header', () => {
          const doc = domino.createDocument('<table><tr><th><a></a></th></tr></table>')
          const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
          assert.deepEqual(actual, [])
        })

        describe('and link is nonempty', () => {
          it('and doesn\'t match page title, should find header', () => {
            const doc = domino.createDocument('<table><tr><th><a>text</a></th></tr></table>')
            const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
            assert.deepEqual(actual, ['text'])
          })

          it('and matches page title, shouldn\'t find header', () => {
            const doc = domino.createDocument('<table><tr><th><a>pageTitle</a></th></tr></table>')
            const actual = getTableHeader(doc.querySelector('table'), 'pageTitle')
            assert.deepEqual(actual, [])
          })

          it('and no page title, shouldn\'t find header', () => {
            const doc = domino.createDocument('<table><tr><th><a>text</a></th></tr></table>')
            const actual = getTableHeader(doc.querySelector('table'))
            assert.deepEqual(actual, [])
          })
        })
      })
    })
  })
})