import applib from '../../build/applib'
import assert from 'assert'
import domino from 'domino'

describe('CollapseTable', () => {
  describe('getTableHeader()', () => {
    const getTableHeader = applib.CollapseTable.test.getTableHeader

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

  describe('toggleCollapseClickCallback()', () => {
    const toggleCollapseClickCallback = applib.CollapseTable.toggleCollapseClickCallback

    describe('and an expanded container', () => {
      beforeEach(function Test() {
        const html = `
          <div id=header><span class=app_table_collapsed_caption></span></div>
          <table></table>
          <div id=footer></div>`
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
          const caption = this.doc.querySelector('span')
          assert.ok(caption.style.visibility !== 'hidden')
        })

        it('the caption is hidden when clicked twice', function Test() {
          this.header.click()
          this.header.click()
          const caption = this.doc.querySelector('span')
          assert.deepEqual(caption.style.visibility, 'hidden')
        })

        it('the table is collapsed when clicked', function Test() {
          this.header.click()
          const table = this.doc.querySelector('table')
          assert.deepEqual(table.style.display, 'none')
        })

        it('the table is expanded when clicked twice', function Test() {
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

  describe('shouldTableBeCollapsed()', () => {
    const shouldTableBeCollapsed = applib.CollapseTable.test.shouldTableBeCollapsed

    it('the table is generic and should be collapsed', () => {
      const doc = domino.createDocument('<table></table>')
      assert.ok(shouldTableBeCollapsed(doc.querySelector('table')))
    })

    it('the table is already collapsed and shouldn\'t be collapsed again', () => {
      const doc = domino.createDocument('<table style="display: none"></table>')
      assert.ok(!shouldTableBeCollapsed(doc.querySelector('table')))
    })

    describe('the table is a navbox and shouldn\'t be collapsed', () => {
      for (const clazz of ['navbox', 'vertical-navbox', 'navbox-inner']) {
        it(`as identified by the class "${clazz}"`, () => {
          const doc = domino.createDocument(`<table class=${clazz}></table>`)
          assert.ok(!shouldTableBeCollapsed(doc.querySelector('table')))
        })
      }
    })

    // https://www.mediawiki.org/wiki/Template:Mbox
    it('the table is a multi namespace message box and shouldn\'t be collapsed', () => {
      const doc = domino.createDocument('<table class=mbox-small></table>')
      assert.ok(!shouldTableBeCollapsed(doc.querySelector('table')))
    })
  })

  describe('isInfobox()', () => {
    const isInfobox = applib.CollapseTable.test.isInfobox

    it('the element is not an infobox', () => {
      const doc = domino.createDocument('<div></div>')
      assert.ok(!isInfobox(doc.querySelector('div')))
    })

    it('the element is an infobox', () => {
      const doc = domino.createDocument('<div class=infobox></div>')
      assert.ok(isInfobox(doc.querySelector('div')))
    })
  })

  describe('newCollapsedHeaderDiv()', () => {
    const newCollapsedHeaderDiv = applib.CollapseTable.test.newCollapsedHeaderDiv

    it('the div is created', () => {
      const div = newCollapsedHeaderDiv(domino.createDocument())
      assert.ok(div instanceof domino.impl.HTMLDivElement)
    })

    it('the div is a container', () => {
      const div = newCollapsedHeaderDiv(domino.createDocument())
      assert.ok(div.classList.contains('app_table_collapsed_container'))
    })

    it('the div is expanded', () => {
      const div = newCollapsedHeaderDiv(domino.createDocument())
      assert.ok(div.classList.contains('app_table_collapsed_open'))
    })

    it('when contents is undefined, the div has no contents', () => {
      const div = newCollapsedHeaderDiv(domino.createDocument())
      assert.ok(!div.innerHTML)
    })

    it('when contents are defined, the div has contents', () => {
      const div = newCollapsedHeaderDiv(domino.createDocument(), 'contents')
      assert.deepEqual(div.innerHTML, 'contents')
    })
  })

  describe('newCollapsedFooterDiv()', () => {
    const newCollapsedFooterDiv = applib.CollapseTable.test.newCollapsedFooterDiv

    it('the div is created', () => {
      const div = newCollapsedFooterDiv(domino.createDocument())
      assert.ok(div instanceof domino.impl.HTMLDivElement)
    })

    it('the div is a footer div', () => {
      const div = newCollapsedFooterDiv(domino.createDocument())
      assert.ok(div.classList.contains('app_table_collapsed_bottom'))
    })

    it('the div has an icon', () => {
      const div = newCollapsedFooterDiv(domino.createDocument())
      assert.ok(div.classList.contains('app_table_collapse_icon'))
    })

    it('when contents is undefined, the div has no contents', () => {
      const div = newCollapsedFooterDiv(domino.createDocument())
      assert.ok(!div.innerHTML)
    })

    it('when contents are defined, the div has contents', () => {
      const div = newCollapsedFooterDiv(domino.createDocument(), 'contents')
      assert.deepEqual(div.innerHTML, 'contents')
    })
  })

  describe('newCaption()', () => {
    const newCaption = applib.CollapseTable.test.newCaption

    describe('when no header text', () => {
      const caption = newCaption('title', [])

      it('the title is present', () => {
        assert.ok(caption.includes('title'))
      })

      it('no additional text is shown', () => {
        assert.ok(!caption.includes(','))
      })
    })

    describe('when a one element header text', () => {
      const caption = newCaption('title', ['0'])

      it('the title is present', () => {
        assert.ok(caption.includes('title'))
      })

      it('the first entry is shown', () => {
        assert.ok(caption.includes('0'))
      })

      it('an ellipsis is shown', () => {
        assert.ok(caption.includes('…'))
      })
    })

    describe('when a two element header text', () => {
      const caption = newCaption('title', ['0', '1'])

      it('the title is present', () => {
        assert.ok(caption.includes('title'))
      })

      it('the first entry is shown', () => {
        assert.ok(caption.includes('0'))
      })

      it('an ellipsis is shown', () => {
        assert.ok(caption.includes('…'))
      })

      it('the second entry is shown', () => {
        assert.ok(caption.includes('1'))
      })
    })
  })

  describe('collapseTables()', () => {
    const collapseTables = applib.CollapseTable.collapseTables

    it('when no tables exist, nothing is done', () => {
      const doc = domino.createDocument('<html></html>')
      collapseTables(doc, doc.documentElement, 'pageTitle')
      assert.ok(doc.querySelector('html'))
    })

    describe('when one table exists', () => {
      beforeEach(function Test() {
        const html = '<table><tr><th><a>text</a></th></tr></table>'
        this.doc = domino.createDocument(html)
        this.assertTableIsExpanded = () => {
          assert.ok(this.doc.querySelector('table').style.display !== 'none')
        }
        this.assertTableIsCollapsed = () => {
          assert.deepEqual(this.doc.querySelector('table').style.display, 'none')
        }
      })

      it('and it\'s a main page, nothing is done', function Test() {
        collapseTables(this.doc, this.doc.documentElement, 'pageTitle', true)
        this.assertTableIsExpanded()
      })

      it('and it\'s already inside of a container, nothing is done', function Test() {
        this.doc.querySelector('table').parentNode.classList.add('app_table_container')
        collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
        this.assertTableIsExpanded()
      })

      it('and it shouldn\'t be collapsed, nothing is done', function Test() {
        this.doc.querySelector('table').classList.add('navbox')
        collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
        this.assertTableIsExpanded()
      })

      describe('and no header text', () => {
        beforeEach(function Test() {
          const tableHeader = this.doc.querySelector('tr')
          tableHeader.parentNode.removeChild(tableHeader)
        })

        it('and table is not an infobox, nothing is done', function Test() {
          collapseTables(this.doc, this.doc.documentElement)
          this.assertTableIsExpanded()
        })

        it('and table is an infobox, table is collapsed', function Test() {
          this.doc.querySelector('table').classList.add('infobox')
          collapseTables(this.doc, this.doc.documentElement)
          this.assertTableIsCollapsed()
        })
      })

      describe('and table is eligible,', () => {
        it('table is collapsed', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
          this.assertTableIsCollapsed()
        })

        it('table is replaced with a new container in the parent', function Test() {
          const table = this.doc.querySelector('table')
          table.parentNode.id = 'container'
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
          assert.ok(table.parentNode.id !== 'container')
        })

        it('table is wrapped in a container', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
          const table = this.doc.querySelector('table')
          assert.ok(table.parentNode.classList.contains('app_table_container'))
        })

        it('table has a header', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
          assert.ok(this.doc.querySelector('.app_table_collapsed_open'))
        })

        it('table has a footer', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
          assert.ok(this.doc.querySelector('.app_table_collapsed_bottom'))
        })

        it('table expands when header is clicked', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
          this.doc.querySelector('table').parentNode.children[0].click()
          this.assertTableIsExpanded()
        })

        it('table expands when footer is clicked', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
          this.doc.querySelector('table').parentNode.children[2].click()
          this.assertTableIsExpanded()
        })

        it('footer click callback is not called when header is expanded', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle', null, null, null, null,
            () => { assert.fail() })
          this.doc.querySelector('table').parentNode.children[0].click()
          this.doc.querySelector('table').parentNode.children[0].click()
        })

        it('footer click callback is called when footer is expanded', function Test(done) {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle', null, null, null, null,
            () => { done() })
          this.doc.querySelector('table').parentNode.children[2].click()
          this.doc.querySelector('table').parentNode.children[2].click()
        })

        it('table header is unused', function Test() {
          collapseTables(this.doc, this.doc.documentElement)
          const header = this.doc.querySelector('.app_table_collapsed_open')
          assert.ok(!header)
        })

        it('and page title is specified, table header is used', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
          const header = this.doc.querySelector('.app_table_collapsed_open')
          assert.ok(header.innerHTML.includes('text'))
        })

        describe('and table is an infobox,', () => {
          beforeEach(function Test() {
            this.doc.querySelector('table').classList.add('infobox')
          })

          it('and page title is specified, header is used', function Test() {
            collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
            const header = this.doc.querySelector('.app_table_collapsed_open')
            assert.ok(header.innerHTML.includes('text'))
          })

          it('and infobox title is specified, infobox title is used', function Test() {
            collapseTables(this.doc, this.doc.documentElement, 'pageTitle', null, 'infoboxTitle')
            const header = this.doc.querySelector('.app_table_collapsed_open')
            assert.ok(header.innerHTML.includes('infoboxTitle'))
          })
        })

        it('and non-infobox title is specified, non-infobox title is used', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle', null, null, 'otherTitle')
          const header = this.doc.querySelector('.app_table_collapsed_open')
          assert.ok(header.innerHTML.includes('otherTitle'))
        })

        it('footer title is unused', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle')
          const footer = this.doc.querySelector('.app_table_collapsed_bottom')
          assert.ok(!footer.innerHTML)
        })

        it('and footer title is specified, footer title is used', function Test() {
          collapseTables(this.doc, this.doc.documentElement, 'pageTitle', null, null, null,
            'footerTitle')
          const footer = this.doc.querySelector('.app_table_collapsed_bottom')
          assert.deepEqual(footer.innerHTML, 'footerTitle')
        })
      })
    })

    it('when more than one eligible table exists, each is collapsed', () => {
      const html = `
        <table id=a class=infobox></table>
        <table id=b></table>
        <table id=c class=infobox></table>
        <table id=d class=infobox></table>`
      const doc = domino.createDocument(html)
      collapseTables(doc, doc.documentElement)
      assert.deepEqual(doc.getElementById('a').style.display, 'none')
      assert.ok(!doc.getElementById('b').style.display)
      assert.deepEqual(doc.getElementById('c').style.display, 'none')
      assert.deepEqual(doc.getElementById('d').style.display, 'none')
    })
  })
})