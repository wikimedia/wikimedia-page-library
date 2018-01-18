import './CollapseTable.css'
import Polyfill from './Polyfill'
import elementUtilities from './ElementUtilities'

const SECTION_TOGGLED_EVENT_TYPE = 'section-toggled'

/**
 * Determine if we want to extract text from this header.
 * @param {!Element} header
 * @return {!boolean}
 */
const isHeaderEligible = header => Polyfill.querySelectorAll(header, 'a').length < 3

/**
 * Extracts header text.
 * @param {!Document} document
 * @param {!Element} header
 * @return {?string}
 */
const extractHeaderText = (document, header) => {
  // Clone header into fragment. This is done so we can remove some elements we don't want
  // represented when "textContent" is used. Because we've cloned the header into a fragment, we are
  // free to strip out anything we want without worrying about affecting the visible document.
  const fragment = document.createDocumentFragment()
  fragment.appendChild(header.cloneNode(true))
  Polyfill.querySelectorAll(fragment, '.geo, .coordinates, sup.reference')
    .forEach(el => el.remove())
  return fragment.textContent.trim()
}

/**
 * Find an array of table header (TH) contents. If there are no TH elements in
 * the table or the header's link matches pageTitle, an empty array is returned.
 * @param {!Document} document
 * @param {!Element} element
 * @param {?string} pageTitle Unencoded page title; if this title matches the
 *                            contents of the header exactly, it will be omitted.
 * @return {!Array<string>}
 */
const getTableHeaderTextArray = (document, element, pageTitle) => {
  const headerTextArray = []
  const headers = Polyfill.querySelectorAll(element, 'th')
  for (let i = 0; i < headers.length; ++i) {
    const header = headers[i]
    if (isHeaderEligible(header)) {
      const headerText = extractHeaderText(document, header)
      // Also ignore it if it's identical to the page title.
      if ((headerText && headerText.length) > 0
        && headerText !== pageTitle && header.innerHTML !== pageTitle) {
        headerTextArray.push(headerText)
      }
    }
    if (headerTextArray.length === 2) {
      // 'newCaptionFragment' only ever uses the first 2 items.
      break
    }
  }
  return headerTextArray
}

/**
 * @typedef {function} FooterDivClickCallback
 * @param {!HTMLElement}
 * @return {void}
 */

/**
 * @param {!Element} container div
 * @param {?Element} trigger element that was clicked or tapped
 * @param {?FooterDivClickCallback} footerDivClickCallback
 * @return {boolean} true if collapsed, false if expanded.
 */
const toggleCollapsedForContainer = function(container, trigger, footerDivClickCallback) {
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
    if (trigger === footer && footerDivClickCallback) {
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
 * Ex: toggleCollapseClickCallback.bind(el, (container) => {
 *       window.scrollTo(0, container.offsetTop - transformer.getDecorOffset())
 *     })
 * @this HTMLElement
 * @param {?FooterDivClickCallback} footerDivClickCallback
 * @return {boolean} true if collapsed, false if expanded.
 */
const toggleCollapseClickCallback = function(footerDivClickCallback) {
  const container = this.parentNode
  return toggleCollapsedForContainer(container, this, footerDivClickCallback)
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
 * @param {!DocumentFragment} content
 * @return {!HTMLDivElement}
 */
const newCollapsedHeaderDiv = (document, content) => {
  const div = document.createElement('div')
  div.classList.add('pagelib_collapse_table_collapsed_container')
  div.classList.add('pagelib_collapse_table_expanded')
  div.appendChild(content)
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
 * @param {!Document} document
 * @param {!string} title
 * @param {!Array.<string>} headerText
 * @return {!DocumentFragment}
 */
const newCaptionFragment = (document, title, headerText) => {
  const fragment = document.createDocumentFragment()

  const strong = document.createElement('strong')
  strong.innerHTML = title
  fragment.appendChild(strong)

  const span = document.createElement('span')
  span.classList.add('pagelib_collapse_table_collapse_text')
  if (headerText.length > 0) {
    span.appendChild(document.createTextNode(`: ${headerText[0]}`))
  }
  if (headerText.length > 1) {
    span.appendChild(document.createTextNode(`, ${headerText[1]}`))
  }
  if (headerText.length > 0) {
    span.appendChild(document.createTextNode(' …'))
  }
  fragment.appendChild(span)

  return fragment
}

/**
 * @param {!Window} window
 * @param {!Document} document
 * @param {?string} pageTitle
 * @param {?boolean} isMainPage
 * @param {?boolean} isInitiallyCollapsed
 * @param {?string} infoboxTitle
 * @param {?string} otherTitle
 * @param {?string} footerTitle
 * @param {?FooterDivClickCallback} footerDivClickCallback
 * @return {void}
 */
const adjustTables = (window, document, pageTitle, isMainPage, isInitiallyCollapsed,
  infoboxTitle, otherTitle, footerTitle, footerDivClickCallback) => {
  if (isMainPage) { return }

  const tables = document.querySelectorAll('table')
  for (let i = 0; i < tables.length; ++i) {
    const table = tables[i]

    if (elementUtilities.findClosestAncestor(table, '.pagelib_collapse_table_container')
      || !shouldTableBeCollapsed(table)) {
      continue
    }

    const headerTextArray = getTableHeaderTextArray(document, table, pageTitle)
    if (!headerTextArray.length && !isInfobox(table)) {
      continue
    }
    const captionFragment =
      newCaptionFragment(document, isInfobox(table) ? infoboxTitle : otherTitle, headerTextArray)

    // create the container div that will contain both the original table
    // and the collapsed version.
    const containerDiv = document.createElement('div')
    containerDiv.className = 'pagelib_collapse_table_container'
    table.parentNode.insertBefore(containerDiv, table)
    table.parentNode.removeChild(table)

    // remove top and bottom margin from the table, so that it's flush with
    // our expand/collapse buttons
    table.style.marginTop = '0px'
    table.style.marginBottom = '0px'

    const collapsedHeaderDiv = newCollapsedHeaderDiv(document, captionFragment)
    collapsedHeaderDiv.style.display = 'block'

    const collapsedFooterDiv = newCollapsedFooterDiv(document, footerTitle)
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

    if (!isInitiallyCollapsed) {
      toggleCollapsedForContainer(containerDiv)
    }
  }
}

/**
 * @param {!Window} window
 * @param {!Document} document
 * @param {?string} pageTitle
 * @param {?boolean} isMainPage
 * @param {?string} infoboxTitle
 * @param {?string} otherTitle
 * @param {?string} footerTitle
 * @param {?FooterDivClickCallback} footerDivClickCallback
 * @return {void}
 */
const collapseTables = (window, document, pageTitle, isMainPage, infoboxTitle, otherTitle,
  footerTitle, footerDivClickCallback) => {
  adjustTables(window, document, pageTitle, isMainPage, true, infoboxTitle, otherTitle,
    footerTitle, footerDivClickCallback)
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
  adjustTables,
  expandCollapsedTableIfItContainsElement,
  test: {
    getTableHeaderTextArray,
    shouldTableBeCollapsed,
    isInfobox,
    newCollapsedHeaderDiv,
    newCollapsedFooterDiv,
    newCaptionFragment
  }
}