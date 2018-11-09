import './CollapseTable.css'
import ElementUtilities from './ElementUtilities'
import NodeUtilities from './NodeUtilities'
import Polyfill from './Polyfill'

const SECTION_TOGGLED_EVENT_TYPE = 'section-toggled'
const BREAKING_SPACE = ' '
const CLASS = {
  ICON: 'pagelib_collapse_table_icon',
  CONTAINER: 'pagelib_collapse_table_container',
  COLLAPSED_CONTAINER: 'pagelib_collapse_table_collapsed_container',
  COLLAPSED: 'pagelib_collapse_table_collapsed',
  COLLAPSED_BOTTOM: 'pagelib_collapse_table_collapsed_bottom',
  COLLAPSE_TEXT: 'pagelib_collapse_table_collapse_text',
  EXPANDED: 'pagelib_collapse_table_expanded',
}

/**
 * Determine if we want to extract text from this header.
 * @param {!Element} header
 * @return {!boolean}
 */
const isHeaderEligible =
  header => header.childNodes && Polyfill.querySelectorAll(header, 'a').length < 3

/**
 * Determine eligibility of extracted text.
 * @param {?string} headerText
 * @return {!boolean}
 */
const isHeaderTextEligible = headerText =>
  headerText && headerText.replace(/[\s0-9]/g, '').length > 0

/**
 * Extracts first word from string. Returns null if for any reason it is unable to do so.
 * @param  {!string} string
 * @return {?string}
 */
const firstWordFromString = string => {
  // 'If the global flag (g) is not set, Element zero of the array contains the entire match,
  // while elements 1 through n contain any submatches.'
  const matches = string.match(/\w+/) // Only need first match so not using 'g' option.
  if (!matches) {
    return undefined
  }
  return matches[0]
}

/**
 * Is node's textContent too similar to pageTitle. Checks if the first word of the node's
 * textContent is found at the beginning of pageTitle.
 * @param  {!Node} node
 * @param  {!string} pageTitle
 * @return {!boolean}
 */
const isNodeTextContentSimilarToPageTitle = (node, pageTitle) => {
  const firstPageTitleWord = firstWordFromString(pageTitle)
  const firstNodeTextContentWord = firstWordFromString(node.textContent)
  // Don't claim similarity if 1st words were not extracted.
  if (!firstPageTitleWord || !firstNodeTextContentWord) {
    return false
  }
  return firstPageTitleWord.toLowerCase() === firstNodeTextContentWord.toLowerCase()
}

/**
 * Removes leading and trailing whitespace and normalizes other whitespace - i.e. ensures
 * non-breaking spaces, tabs, etc are replaced with regular breaking spaces.
 * @param  {!string} string
 * @return {!string}
 */
const stringWithNormalizedWhitespace = string => string.trim().replace(/\s/g, BREAKING_SPACE)

/**
 * Determines if node is a BR.
 * @param  {!Node}  node
 * @return {!boolean}
 */
const isNodeBreakElement = node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR'

/**
 * Replace node with a text node bearing a single breaking space.
 * @param {!Document} document
 * @param  {!Node} node
 * @return {void}
 */
const replaceNodeWithBreakingSpaceTextNode = (document, node) => {
  node.parentNode.replaceChild(document.createTextNode(BREAKING_SPACE), node)
}

/**
 * Extracts any header text determined to be eligible.
 * @param {!Document} document
 * @param {!Element} header
 * @param {?string} pageTitle
 * @return {?string}
 */
const extractEligibleHeaderText = (document, header, pageTitle) => {
  if (!isHeaderEligible(header)) {
    return null
  }
  // Clone header into fragment. This is done so we can remove some elements we don't want
  // represented when "textContent" is used. Because we've cloned the header into a fragment, we are
  // free to strip out anything we want without worrying about affecting the visible document.
  const fragment = document.createDocumentFragment()
  fragment.appendChild(header.cloneNode(true))
  const fragmentHeader = fragment.querySelector('th')

  Polyfill.querySelectorAll(fragmentHeader, '.geo, .coordinates, sup.reference, ol, ul')
    .forEach(el => el.remove())

  const childNodesArray = Array.prototype.slice.call(fragmentHeader.childNodes)
  if (pageTitle) {
    childNodesArray
      .filter(NodeUtilities.isNodeTypeElementOrText)
      .filter(node => isNodeTextContentSimilarToPageTitle(node, pageTitle))
      .forEach(node => node.remove())
  }

  childNodesArray
    .filter(isNodeBreakElement)
    .forEach(node => replaceNodeWithBreakingSpaceTextNode(document, node))

  const headerText = fragmentHeader.textContent
  if (isHeaderTextEligible(headerText)) {
    return stringWithNormalizedWhitespace(headerText)
  }
  return null
}

/**
 * Used to sort array of Elements so those containing 'scope' attribute are moved to front of
 * array. Relative order between 'scope' elements is preserved. Relative order between non 'scope'
 * elements is preserved.
 * @param  {!Element} a
 * @param  {!Element} b
 * @return {!number}
 */
const elementScopeComparator = (a, b) => {
  const aHasScope = a.hasAttribute('scope')
  const bHasScope = b.hasAttribute('scope')
  if (aHasScope && bHasScope) {
    return 0
  }
  if (aHasScope) {
    return -1
  }
  if (bHasScope) {
    return 1
  }
  return 0
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
  headers.sort(elementScopeComparator)
  for (let i = 0; i < headers.length; ++i) {
    const headerText = extractEligibleHeaderText(document, headers[i], pageTitle)
    if (headerText && headerTextArray.indexOf(headerText) === -1) {
      headerTextArray.push(headerText)
      // 'newCaptionFragment' only ever uses the first 2 items.
      if (headerTextArray.length === 2) {
        break
      }
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
    header.classList.remove(CLASS.COLLAPSED)
    header.classList.remove(CLASS.ICON)
    header.classList.add(CLASS.EXPANDED)
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
    header.classList.remove(CLASS.EXPANDED)
    header.classList.add(CLASS.COLLAPSED)
    header.classList.add(CLASS.ICON)
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
const isInfobox = element =>
  element.classList.contains('infobox')
  || element.classList.contains('infobox_v3')

/**
 * @param {!Document} document
 * @param {!DocumentFragment} content
 * @return {!HTMLDivElement}
 */
const newCollapsedHeaderDiv = (document, content) => {
  const div = document.createElement('div')
  div.classList.add(CLASS.COLLAPSED_CONTAINER)
  div.classList.add(CLASS.EXPANDED)
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
  div.classList.add(CLASS.COLLAPSED_BOTTOM)
  div.classList.add(CLASS.ICON)
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
  span.classList.add(CLASS.COLLAPSE_TEXT)
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
 * @param {!Document} document
 * @param {?string} pageTitle use title for this not `display title` (which can contain tags)
 * @param {?string} infoboxTitle
 * @param {?string} otherTitle
 * @param {?string} footerTitle
 * @return {void}
 */
const prepareTables = (document, pageTitle, infoboxTitle, otherTitle, footerTitle) => {
  const tables = document.querySelectorAll('table, .infobox_v3')
  for (let i = 0; i < tables.length; ++i) {
    const table = tables[i]

    if (ElementUtilities.findClosestAncestor(table, `.${CLASS.CONTAINER}`)
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
    containerDiv.className = CLASS.CONTAINER
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
  }
}

/**
 * @param {!Window} window
 * @param {!Document} document
 * @param {?boolean} isInitiallyCollapsed
 * @param {?FooterDivClickCallback} footerDivClickCallback
 * @return {void}
 */
const setupEventHandling = (window, document, isInitiallyCollapsed, footerDivClickCallback) => {
  /**
   * @param {boolean} collapsed
   * @return {boolean}
   */
  const dispatchSectionToggledEvent = collapsed =>
    window.dispatchEvent(new Polyfill.CustomEvent(SECTION_TOGGLED_EVENT_TYPE, { collapsed }))

  // assign click handler to the collapsed divs
  const collapsedHeaderDivs = Polyfill.querySelectorAll(document, `.${CLASS.COLLAPSED_CONTAINER}`)
  collapsedHeaderDivs.forEach(collapsedHeaderDiv => {
    collapsedHeaderDiv.onclick = () => {
      const collapsed = toggleCollapseClickCallback.bind(collapsedHeaderDiv)()
      dispatchSectionToggledEvent(collapsed)
    }
  })

  const collapsedFooterDivs = Polyfill.querySelectorAll(document, `.${CLASS.COLLAPSED_BOTTOM}`)
  collapsedFooterDivs.forEach(collapsedFooterDiv => {
    collapsedFooterDiv.onclick = () => {
      const collapsed = toggleCollapseClickCallback.bind(collapsedFooterDiv,
        footerDivClickCallback)()
      dispatchSectionToggledEvent(collapsed)
    }
  })

  if (!isInitiallyCollapsed) {
    const containerDivs = Polyfill.querySelectorAll(document, `.${CLASS.CONTAINER}`)
    containerDivs.forEach(containerDiv => {
      toggleCollapsedForContainer(containerDiv)
    })
  }
}

/**
 * @param {!Window} window
 * @param {!Document} document
 * @param {?string} pageTitle use title for this not `display title` (which can contain tags)
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

  prepareTables(document, pageTitle, infoboxTitle, otherTitle, footerTitle)
  setupEventHandling(window, document, isInitiallyCollapsed, footerDivClickCallback)
}

/**
 * @param {!Window} window
 * @param {!Document} document
 * @param {?string} pageTitle use title for this not `display title` (which can contain tags)
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
    const containerSelector = `[class*="${CLASS.CONTAINER}"]`
    const container = ElementUtilities.findClosestAncestor(element, containerSelector)
    if (container) {
      const collapsedDiv = container.firstElementChild
      if (collapsedDiv && collapsedDiv.classList.contains(CLASS.EXPANDED)) {
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
  prepareTables,
  setupEventHandling,
  expandCollapsedTableIfItContainsElement,
  test: {
    elementScopeComparator,
    extractEligibleHeaderText,
    firstWordFromString,
    getTableHeaderTextArray,
    shouldTableBeCollapsed,
    isHeaderEligible,
    isHeaderTextEligible,
    isInfobox,
    newCollapsedHeaderDiv,
    newCollapsedFooterDiv,
    newCaptionFragment,
    isNodeTextContentSimilarToPageTitle,
    stringWithNormalizedWhitespace,
    replaceNodeWithBreakingSpaceTextNode
  }
}