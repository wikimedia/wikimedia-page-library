import applib from '../build/applib'
import assert from 'assert'
import domino from 'domino'

describe('CollapseTable', () => {
  describe('getTableHeader()', () => {
    const getTableHeader = applib.CollapseTable.getTableHeader

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

  describe('.toggleCollapseClickCallback()', () => {
    const toggleCollapseClickCallback = applib.CollapseTable.toggleCollapseClickCallback

    describe('and an open container', () => {
      beforeEach(function Test() {
        const html = `<div>
                        <div
                          id=header
                          class='app_table_collapse_close app_table_collapse_icon'
                          style='visibility: visible'>
                          <span
                            id=caption
                            class=app_table_collapsed_caption
                            style='visibility: hidden'
                          </span>
                        </div>
                        <table style='display: block'></table>
                        <div id=footer style='display: block'></div>
                      </div>`
        this.doc = domino.createDocument(html)
      })

      it('where the footer is observed, the callback is invoked when the footer is clicked',
        function Test(done) {
          const footer = this.doc.querySelector('#footer')
          footer.addEventListener('click',
            toggleCollapseClickCallback.bind(footer, () => { done() }))
          footer.click()
        })

      describe('where the header is observed,', () => {
        beforeEach(function Test() {
          this.header = this.doc.querySelector('#header')
          this.header.addEventListener('click',
            toggleCollapseClickCallback.bind(this.header, () => {}))
        })

        it('the callback is not invoked when the header clicked', function Test() {
          this.header.addEventListener('click',
            toggleCollapseClickCallback.bind(this.header, () => { assert.fail() }))
          this.header.click()
        })

        it('the header class list toggles when clicked', function Test() {
          this.header.click()
          assert.ok(this.header.classList.contains('app_table_collapsed_open'))
          assert.ok(!this.header.classList.contains('app_table_collapse_close'))
          assert.ok(!this.header.classList.contains('app_table_collapse_icon'))
        })

        it('the header class list toggles back when clicked twice', function Test() {
          this.header.click()
          this.header.click()
          assert.ok(!this.header.classList.contains('app_table_collapsed_open'))
          assert.ok(this.header.classList.contains('app_table_collapse_close'))
          assert.ok(this.header.classList.contains('app_table_collapse_icon'))
        })

        it('the caption is shown when clicked', function Test() {
          this.header.click()
          const caption = this.doc.querySelector('#caption')
          assert.deepEqual(caption.style.visibility, 'visible')
        })

        it('the caption is hidden when clicked twice', function Test() {
          this.header.click()
          this.header.click()
          const caption = this.doc.querySelector('#caption')
          assert.deepEqual(caption.style.visibility, 'hidden')
        })

        it('the table is hidden when clicked', function Test() {
          this.header.click()
          const table = this.doc.querySelector('table')
          assert.deepEqual(table.style.display, 'none')
        })

        it('the table is shown when clicked twice', function Test() {
          this.header.click()
          this.header.click()
          const table = this.doc.querySelector('table')
          assert.deepEqual(table.style.display, 'block')
        })

        it('the footer is hidden when clicked', function Test() {
          this.header.click()
          const footer = this.doc.querySelector('#footer')
          assert.deepEqual(footer.style.display, 'none')
        })

        it('the footer is shown when clicked twice', function Test() {
          this.header.click()
          this.header.click()
          const footer = this.doc.querySelector('#footer')
          assert.deepEqual(footer.style.display, 'block')
        })
      })
    })
  })
})