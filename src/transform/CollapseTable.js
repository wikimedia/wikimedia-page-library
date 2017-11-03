import './CollapseTable.css'
import Polyfill from './Polyfill'
import elementUtilities from './ElementUtilities'

const SECTION_TOGGLED_EVENT_TYPE = 'section-toggled'

/**
 * Find an array of table header (TH) contents. If there are no TH elements in
 * the table or the header's link matches pageTitle, an empty array is returned.
 * @param {!Element} element
 * @param {?string} pageTitle Unencoded page title; if this title matches the
 *                            contents of the header exactly, it will be omitted.
 * @return {!Array<string>}
 */
const getTableHeader = (element, pageTitle) => {
  const thArray = []
  const headers = Polyfill.querySelectorAll(element, 'th')
  if (headers) {
    for (let i = 0; i < headers.length; ++i) {
      const header = headers[i]
      const anchors = Polyfill.querySelectorAll(header, 'a')
      if (anchors.length < 3) {
        // Also ignore it if it's identical to the page title.
        if ((header.textContent && header.textContent.length) > 0
          && header.textContent !== pageTitle && header.innerHTML !== pageTitle) {
          thArray.push(header.textContent)
        }
      }
      if (thArray.length === 2) {
        // 'newCaption' only ever uses the first 2 items.
        break
      }
    }
  }
  return thArray
}

/**
 * @typedef {function} FooterDivClickCallback
 * @param {!HTMLElement}
 * @return {void}
 */

/**
 * Ex: toggleCollapseClickCallback.bind(el, (container) => {
 *       window.scrollTo(0, container.offsetTop - transformer.getDecorOffset())
 *     })
 * @this HTMLElement
 * @param {?FooterDivClickCallback} footerDivClickCallback
 * @return {boolean} true if collapsed, false if expanded.
 */
const toggleCollapseClickCallback = function(footerDivClickCallback) {
  const container = this.parentNode
  const header = container.children[0]
  const table = container.children[1]
  const footer = container.children[2]
  const caption = header.querySelector('.app_table_collapsed_caption')
  const collapsed = table.style.display !== 'none'
  if (collapsed) {
    table.style.display = 'none'
    header.classList.remove('pagelib_collapse_table_collapsed')
    header.classList.remove('pagelib_collapse_table_icon')
    header.classList.add('pagelib_collapse_table_expanded')
    if (caption) {
      caption.style.visibility = 'visible'
    }
    footer.style.display = 'none'
    // if they clicked the bottom div, then scroll back up to the top of the table.
    if (this === footer && footerDivClickCallback) {
      footerDivClickCallback(container)
    }
  } else {
    table.style.display = 'block'
    header.classList.remove('pagelib_collapse_table_expanded')
    header.classList.add('pagelib_collapse_table_collapsed')
    header.classList.add('pagelib_collapse_table_icon')
    if (caption) {
      caption.style.visibility = 'hidden'
    }
    footer.style.display = 'block'
  }
  return collapsed
}

/**
 * @param {!HTMLElement} table
 * @return {!boolean} true if table should be collapsed, false otherwise.
 */
const shouldTableBeCollapsed = table => {
  const classBlacklist = ['navbox', 'vertical-navbox', 'navbox-inner', 'metadata', 'mbox-small']
  const blacklistIntersects = classBlacklist.some(clazz => table.classList.contains(clazz))
  return table.style.display !== 'none' && !blacklistIntersects
}

/**
 * @param {!Element} element
 * @return {!boolean} true if element is an infobox, false otherwise.
 */
const isInfobox = element => element.classList.contains('infobox')

/**
 * @param {!Document} document
 * @param {?string} content HTML string.
 * @return {!HTMLDivElement}
 */
const newCollapsedHeaderDiv = (document, content) => {
  const div = document.createElement('div')
  div.classList.add('pagelib_collapse_table_collapsed_container')
  div.classList.add('pagelib_collapse_table_expanded')
  div.innerHTML = content || ''
  return div
}

/**
 * @param {!Document} document
 * @param {?string} content HTML string.
 * @return {!HTMLDivElement}
 */
const newCollapsedFooterDiv = (document, content) => {
  const div = document.createElement('div')
  div.classList.add('pagelib_collapse_table_collapsed_bottom')
  div.classList.add('pagelib_collapse_table_icon')
  div.innerHTML = content || ''
  return div
}

/**
 * @param {!string} title
 * @param {!Array.<string>} headerText
 * @return {!string} HTML string.
 */
const newCaption = (title, headerText) => {
  let caption = `<strong>${title}</strong>`

  caption += '<span class=pagelib_collapse_table_collapse_text>'
  if (headerText.length > 0) {
    caption += `: ${headerText[0]}`
  }
  if (headerText.length > 1) {
    caption += `, ${headerText[1]}`
  }
  if (headerText.length > 0) {
    caption += ' …'
  }
  caption += '</span>'

  return caption
}

/**
 * @param {!Window} window
 * @param {!Element} content
 * @param {?string} pageTitle
 * @param {?boolean} isMainPage
 * @param {?string} infoboxTitle
 * @param {?string} otherTitle
 * @param {?string} footerTitle
 * @param {?FooterDivClickCallback} footerDivClickCallback
 * @return {void}
 */
const collapseTables = (window, content, pageTitle, isMainPage, infoboxTitle, otherTitle,
  footerTitle, footerDivClickCallback) => {
  if (isMainPage) { return }

  const tables = content.querySelectorAll('table')
  for (let i = 0; i < tables.length; ++i) {
    const table = tables[i]

    if (elementUtilities.findClosestAncestor(table, '.pagelib_collapse_table_container')
      || !shouldTableBeCollapsed(table)) {
      continue
    }

    // todo: this is actually an array
    const headerText = getTableHeader(table, pageTitle)
    if (!headerText.length && !isInfobox(table)) {
      continue
    }
    const caption = newCaption(isInfobox(table) ? infoboxTitle : otherTitle, headerText)

    // create the container div that will contain both the original table
    // and the collapsed version.
    const containerDiv = window.document.createElement('div')
    containerDiv.className = 'pagelib_collapse_table_container'
    table.parentNode.insertBefore(containerDiv, table)
    table.parentNode.removeChild(table)

    // remove top and bottom margin from the table, so that it's flush with
    // our expand/collapse buttons
    table.style.marginTop = '0px'
    table.style.marginBottom = '0px'

    const collapsedHeaderDiv = newCollapsedHeaderDiv(window.document, caption)
    collapsedHeaderDiv.style.display = 'block'

    const collapsedFooterDiv = newCollapsedFooterDiv(window.document, footerTitle)
    collapsedFooterDiv.style.display = 'none'

    // add our stuff to the container
    containerDiv.appendChild(collapsedHeaderDiv)
    containerDiv.appendChild(table)
    containerDiv.appendChild(collapsedFooterDiv)

    // set initial visibility
    table.style.display = 'none'

    // eslint-disable-next-line require-jsdoc, no-loop-func
    const dispatchSectionToggledEvent = collapsed =>
      // eslint-disable-next-line no-undef
      window.dispatchEvent(new Polyfill.CustomEvent(SECTION_TOGGLED_EVENT_TYPE, { collapsed }))

    // assign click handler to the collapsed divs
    collapsedHeaderDiv.onclick = () => {
      const collapsed = toggleCollapseClickCallback.bind(collapsedHeaderDiv)()
      dispatchSectionToggledEvent(collapsed)
    }
    collapsedFooterDiv.onclick = () => {
      const collapsed = toggleCollapseClickCallback.bind(collapsedFooterDiv,
        footerDivClickCallback)()
      dispatchSectionToggledEvent(collapsed)
    }
  }
}

/**
 * If you tap a reference targeting an anchor within a collapsed table, this
 * method will expand the references section. The client can then scroll to the
 * references section.
 *
 * The first reference (an "[A]") in the "enwiki > Airplane" article from ~June
 * 2016 exhibits this issue. (You can copy wikitext from this revision into a
 * test wiki page for testing.)
 * @param  {?Element} element
 * @return {void}
*/
const expandCollapsedTableIfItContainsElement = element => {
  if (element) {
    const containerSelector = '[class*="pagelib_collapse_table_container"]'
    const container = elementUtilities.findClosestAncestor(element, containerSelector)
    if (container) {
      const collapsedDiv = container.firstElementChild
      if (collapsedDiv && collapsedDiv.classList.contains('pagelib_collapse_table_expanded')) {
        collapsedDiv.click()
      }
    }
  }
}

export default {
  SECTION_TOGGLED_EVENT_TYPE,
  toggleCollapseClickCallback,
  collapseTables,
  expandCollapsedTableIfItContainsElement,
  test: {
    getTableHeader,
    shouldTableBeCollapsed,
    isInfobox,
    newCollapsedHeaderDiv,
    newCollapsedFooterDiv,
    newCaption
  }
}