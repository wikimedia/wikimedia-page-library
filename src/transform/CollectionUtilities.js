import Polyfill from './Polyfill'

/**
 * Extracts array of page issues from element
 * @param {!Document} document
 * @param {?Element} element
 * @return {!Array.<string>} Return empty array if nothing is extracted
 */
const collectPageIssues = (document, element) => {
  if (!element) {
    return []
  }
  const tables =
    Polyfill.querySelectorAll(element, 'table.ambox:not(.ambox-multiple_issues):not(.ambox-notice)')
  // Get the tables into a fragment so we can remove some elements without triggering a layout
  const fragment = document.createDocumentFragment()
  const cloneTableIntoFragment =
    table => fragment.appendChild(table.cloneNode(true)) // eslint-disable-line require-jsdoc
  tables.forEach(cloneTableIntoFragment)
  // Remove some elements we don't want when "textContent" or "innerHTML" are used
  Polyfill.querySelectorAll(fragment, '.hide-when-compact, .collapsed').forEach(el => el.remove())
  return Polyfill.querySelectorAll(fragment, 'td[class*=mbox-text] > *[class*=mbox-text]')
}

/**
 * Extracts array of page issues HTML from element
 * @param {!Document} document
 * @param {?Element} element
 * @return {!Array.<string>} Return empty array if nothing is extracted
 */
const collectPageIssuesHTML = (document, element) =>
  collectPageIssues(document, element).map(el => el.innerHTML)

/**
 * Extracts array of page issues text from element
 * @param {!Document} document
 * @param {?Element} element
 * @return {!Array.<string>} Return empty array if nothing is extracted
 */
const collectPageIssuesText = (document, element) =>
  collectPageIssues(document, element).map(el => el.textContent.trim())

/**
 * Extracts array of disambiguation titles from an element
 * @param {?Element} element
 * @return {!Array.<string>} Return empty array if nothing is extracted
 */
const collectDisambiguationTitles = element => {
  if (!element) {
    return []
  }
  return Polyfill.querySelectorAll(element, 'div.hatnote a[href]:not([href=""]):not([redlink="1"])')
    .map(el => el.href)
}

/**
 * Extracts array of disambiguation items html from an element
 * @param {?Element} element
 * @return {!Array.<string>} Return empty array if nothing is extracted
 */
const collectDisambiguationHTML = element => {
  if (!element) {
    return []
  }
  return Polyfill.querySelectorAll(element, 'div.hatnote').map(el => el.innerHTML)
}

export default {
  collectDisambiguationTitles,
  collectDisambiguationHTML,
  collectPageIssuesHTML,
  collectPageIssuesText,
  test: {
    collectPageIssues
  }
}