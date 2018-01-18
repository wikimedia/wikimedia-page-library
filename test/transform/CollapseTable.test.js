import assert from 'assert'
import domino from 'domino'
import pagelib from '../../build/wikimedia-page-library-transform'

describe('CollapseTable', () => {
  describe('getTableHeaderTextArray()', () => {
    const getTableHeaderTextArray = pagelib.CollapseTable.test.getTableHeaderTextArray

    it('when no table, shouldn\'t find headers', () => {
      const doc = domino.createDocument('<html></html>')
      const actual = getTableHeaderTextArray(doc, doc.documentElement, 'pageTitle')
      assert.deepEqual(actual, [])
    })

    describe('when table', () => {
      it('and no header, shouldn\'t find headers', () => {
        const doc = domino.createDocument('<table></table>')
        const actual = getTableHeaderTextArray(doc, doc.querySelector('table'), 'pageTitle')
        assert.deepEqual(actual, [])
      })

      it('and header is empty, shouldn\'t find headers', () => {
        const doc = domino.createDocument('<table><tr><th></th></tr></table>')
        const actual = getTableHeaderTextArray(doc, doc.querySelector('table'), 'pageTitle')
        assert.deepEqual(actual, [])
      })

      describe('and header is nonempty', () => {
        it('and link is empty, shouldn\'t find header', () => {
          const doc = domino.createDocument('<table><tr><th><a></a></th></tr></table>')
          const actual = getTableHeaderTextArray(doc, doc.querySelector('table'), 'pageTitle')
          assert.deepEqual(actual, [])
        })

        describe('and link is nonempty', () => {
          it('and doesn\'t match page title, should find header', () => {
            const doc = domino.createDocument('<table><tr><th><a>text</a></th></tr></table>')
            const actual = getTableHeaderTextArray(doc, doc.querySelector('table'), 'pageTitle')
            assert.deepEqual(actual, ['text'])
          })

          it('and matches page title, shouldn\'t find header', () => {
            const doc = domino.createDocument('<table><tr><th><a>pageTitle</a></th></tr></table>')
            const actual = getTableHeaderTextArray(doc, doc.querySelector('table'), 'pageTitle')
            assert.deepEqual(actual, [])
          })

          it('and no page title, should find header', () => {
            const doc = domino.createDocument('<table><tr><th><a>text</a></th></tr></table>')
            const actual = getTableHeaderTextArray(doc, doc.querySelector('table'))
            assert.deepEqual(actual, ['text'])
          })
        })
      })
    })
  })

  describe('toggleCollapseClickCallback()', () => {
    const toggleCollapseClickCallback = pagelib.CollapseTable.toggleCollapseClickCallback

    describe('and an expanded container', () => {
      beforeEach(function Test() {
        const html = `
          <div id=header><span class=app_table_collapsed_caption></span></div>
          <table></table>
          <div id=footer></div>`
        this.doc = domino.createDocument(html)
      })

      describe('where the footer is observed', () => {
        it('the callback is invoked when the footer is clicked',
          function Test(done) {
            const footer = this.doc.querySelector('#footer')
            footer.addEventListener('click',
              toggleCollapseClickCallback.bind(footer, () => done()))
            footer.click()
          })

        it('nothing breaks when the callback is not set and the footer is clicked',
          function Test() {
            const footer = this.doc.querySelector('#footer')
            footer.addEventListener('click',
              toggleCollapseClickCallback.bind(footer, undefined))
            footer.click()
          })
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
          assert.ok(this.header.classList.contains('pagelib_collapse_table_expanded'))
          assert.ok(!this.header.classList.contains('pagelib_collapse_table_collapsed'))
          assert.ok(!this.header.classList.contains('pagelib_collapse_table_icon'))
        })

        it('the header class list toggles back when clicked twice', function Test() {
          this.header.click()
          this.header.click()
          assert.ok(!this.header.classList.contains('pagelib_collapse_table_expanded'))
          assert.ok(this.header.classList.contains('pagelib_collapse_table_collapsed'))
          assert.ok(this.header.classList.contains('pagelib_collapse_table_icon'))
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
    const shouldTableBeCollapsed = pagelib.CollapseTable.test.shouldTableBeCollapsed

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
    const isInfobox = pagelib.CollapseTable.test.isInfobox

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
    const newCollapsedHeaderDiv = pagelib.CollapseTable.test.newCollapsedHeaderDiv

    it('the div is created', () => {
      const div = newCollapsedHeaderDiv(domino.createDocument())
      assert.ok(div instanceof domino.impl.HTMLDivElement)
    })

    it('the div is a container', () => {
      const div = newCollapsedHeaderDiv(domino.createDocument())
      assert.ok(div.classList.contains('pagelib_collapse_table_collapsed_container'))
    })

    it('the div is expanded', () => {
      const div = newCollapsedHeaderDiv(domino.createDocument())
      assert.ok(div.classList.contains('pagelib_collapse_table_expanded'))
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
    const newCollapsedFooterDiv = pagelib.CollapseTable.test.newCollapsedFooterDiv

    it('the div is created', () => {
      const div = newCollapsedFooterDiv(domino.createDocument())
      assert.ok(div instanceof domino.impl.HTMLDivElement)
    })

    it('the div is a footer div', () => {
      const div = newCollapsedFooterDiv(domino.createDocument())
      assert.ok(div.classList.contains('pagelib_collapse_table_collapsed_bottom'))
    })

    it('the div has an icon', () => {
      const div = newCollapsedFooterDiv(domino.createDocument())
      assert.ok(div.classList.contains('pagelib_collapse_table_icon'))
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
    const newCaption = pagelib.CollapseTable.test.newCaption

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
    const collapseTables = pagelib.CollapseTable.collapseTables

    it('when no tables exist, nothing is done', () => {
      const window = domino.createWindow('<html></html>')
      collapseTables(window, window.document, 'pageTitle')
      assert.ok(window.document.querySelector('html'))
    })

    describe('when one table exists', () => {
      beforeEach(function Test() {
        const html = '<table><tr><th><a>text</a></th></tr></table>'
        this.window = domino.createWindow(html)
        this.assertTableIsExpanded = () => {
          assert.ok(this.window.document.querySelector('table').style.display !== 'none')
        }
        this.assertTableIsCollapsed = () => {
          assert.deepEqual(this.window.document.querySelector('table').style.display, 'none')
        }
      })

      it('and it\'s a main page, nothing is done', function Test() {
        collapseTables(this.window, this.window.document, 'pageTitle', true)
        this.assertTableIsExpanded()
      })

      it('and it\'s already inside of a container, nothing is done', function Test() {
        this.window.document.querySelector('table')
          .parentNode.classList.add('pagelib_collapse_table_container')
        collapseTables(this.window, this.window.document, 'pageTitle')
        this.assertTableIsExpanded()
      })

      it('and it shouldn\'t be collapsed, nothing is done', function Test() {
        this.window.document.querySelector('table').classList.add('navbox')
        collapseTables(this.window, this.window.document, 'pageTitle')
        this.assertTableIsExpanded()
      })

      describe('and no header text', () => {
        beforeEach(function Test() {
          const tableHeader = this.window.document.querySelector('tr')
          tableHeader.parentNode.removeChild(tableHeader)
        })

        it('and table is not an infobox, nothing is done', function Test() {
          collapseTables(this.window, this.window.document)
          this.assertTableIsExpanded()
        })

        it('and table is an infobox, table is collapsed', function Test() {
          this.window.document.querySelector('table').classList.add('infobox')
          collapseTables(this.window, this.window.document)
          this.assertTableIsCollapsed()
        })
      })

      describe('and table is eligible,', () => {
        it('table is collapsed', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle')
          this.assertTableIsCollapsed()
        })

        it('table is replaced with a new container in the parent', function Test() {
          const table = this.window.document.querySelector('table')
          table.parentNode.id = 'container'
          collapseTables(this.window, this.window.document, 'pageTitle')
          assert.ok(table.parentNode.id !== 'container')
        })

        it('table is wrapped in a container', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle')
          const table = this.window.document.querySelector('table')
          assert.ok(table.parentNode.classList.contains('pagelib_collapse_table_container'))
        })

        it('table has a header', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle')
          assert.ok(this.window.document.querySelector('.pagelib_collapse_table_expanded'))
        })

        it('table has a footer', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle')
          assert.ok(this.window.document.querySelector('.pagelib_collapse_table_collapsed_bottom'))
        })

        it('table expands when header is clicked', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle')
          this.window.document.querySelector('table').parentNode.children[0].click()
          this.assertTableIsExpanded()
        })

        it('event is emitted when header is clicked', function Test(done) {
          collapseTables(this.window, this.window.document, 'pageTitle')
          this.window.addEventListener(pagelib.CollapseTable.SECTION_TOGGLED_EVENT_TYPE, event => {
            assert.ok(!event.collapsed)
            done()
          })
          this.window.document.querySelector('table').parentNode.children[2].click()
        })

        it('table expands when footer is clicked', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle')
          this.window.document.querySelector('table').parentNode.children[2].click()
          this.assertTableIsExpanded()
        })

        it('footer click callback is not called when header is expanded', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle', null, null, null, null,
            () => { assert.fail() })
          this.window.document.querySelector('table').parentNode.children[0].click()
          this.window.document.querySelector('table').parentNode.children[0].click()
        })

        it('footer click callback is called when footer is expanded', function Test(done) {
          collapseTables(this.window, this.window.document, 'pageTitle', null, null, null, null,
            () => done())
          this.window.document.querySelector('table').parentNode.children[2].click()
          this.window.document.querySelector('table').parentNode.children[2].click()
        })

        it('event is emitted when footer is clicked', function Test(done) {
          collapseTables(this.window, this.window.document, 'pageTitle')
          this.window.document.querySelector('table').parentNode.children[2].click()
          this.window.addEventListener(pagelib.CollapseTable.SECTION_TOGGLED_EVENT_TYPE, event => {
            assert.ok(event.collapsed)
            done()
          })
          this.window.document.querySelector('table').parentNode.children[2].click()
        })

        it('table header is used', function Test() {
          collapseTables(this.window, this.window.document)
          const header = this.window.document.querySelector('.pagelib_collapse_table_expanded')
          assert.ok(header)
        })

        it('and page title is specified, table header is used', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle')
          const header = this.window.document.querySelector('.pagelib_collapse_table_expanded')
          assert.ok(header.innerHTML.includes('text'))
        })

        describe('and table is an infobox,', () => {
          beforeEach(function Test() {
            this.window.document.querySelector('table').classList.add('infobox')
          })

          it('and page title is specified, header is used', function Test() {
            collapseTables(this.window, this.window.document, 'pageTitle')
            const header = this.window.document.querySelector('.pagelib_collapse_table_expanded')
            assert.ok(header.innerHTML.includes('text'))
          })

          it('and infobox title is specified, infobox title is used', function Test() {
            collapseTables(this.window, this.window.document, 'pageTitle', null, 'infoboxTitle')
            const header = this.window.document.querySelector('.pagelib_collapse_table_expanded')
            assert.ok(header.innerHTML.includes('infoboxTitle'))
          })
        })

        it('and non-infobox title is specified, non-infobox title is used', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle', null, null, 'otherTitle')
          const header = this.window.document.querySelector('.pagelib_collapse_table_expanded')
          assert.ok(header.innerHTML.includes('otherTitle'))
        })

        it('footer title is unused', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle')
          const footer =
            this.window.document.querySelector('.pagelib_collapse_table_collapsed_bottom')
          assert.ok(!footer.innerHTML)
        })

        it('and footer title is specified, footer title is used', function Test() {
          collapseTables(this.window, this.window.document, 'pageTitle', null, null, null,
            'footerTitle')
          const footer =
            this.window.document.querySelector('.pagelib_collapse_table_collapsed_bottom')
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
      const window = domino.createWindow(html)
      collapseTables(window, window.document)
      assert.deepEqual(window.document.getElementById('a').style.display, 'none')
      assert.ok(!window.document.getElementById('b').style.display)
      assert.deepEqual(window.document.getElementById('c').style.display, 'none')
      assert.deepEqual(window.document.getElementById('d').style.display, 'none')
    })
  })

  describe('expandCollapsedTableIfItContainsElement()', () => {
    // eslint-disable-next-line max-len
    const expandCollapsedTableIfItContainsElement =
      pagelib.CollapseTable.expandCollapsedTableIfItContainsElement

    it('when element is undefined, nothing is done', () => {
      const element = undefined
      expandCollapsedTableIfItContainsElement(element)
    })

    describe('when element is defined', () => {
      it('and element is not within a collapse table container, nothing is done', () => {
        const element = domino.createDocument('<a></a>').documentElement
        element.addEventListener('click', assert.fail)
        expandCollapsedTableIfItContainsElement(element)
      })

      describe('and element is within a collapse table container that has children', () => {
        it('and table is already expanded, nothing is done', () => {
          const html = `
            <div class=pagelib_collapse_table_container>
              <div class=pagelib_collapse_table_collapsed></div>
            </div>`
          const element = domino.createDocument(html).querySelector('div div')
          element.addEventListener('click', assert.fail)
          expandCollapsedTableIfItContainsElement(element)
        })

        it('and table is collapsed, the table is expanded', done => {
          const html = `
            <div class=pagelib_collapse_table_container>
              <div class=pagelib_collapse_table_expanded></div>
            </div>`
          const element = domino.createDocument(html).querySelector('div div')
          element.addEventListener('click', () => done())
          expandCollapsedTableIfItContainsElement(element)
        })
      })
    })
  })
})