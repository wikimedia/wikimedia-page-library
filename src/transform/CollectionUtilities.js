import Polyfill from './Polyfill'

/**
 * Extracts array of page issues from element
 * @param {!Document} document
 * @return {!Array.<string>} Return empty array if nothing is extracted
 */
const collectPageIssues = document => {
  if (!document) {
    return []
  }
  return Polyfill.querySelectorAll(document, '.mbox-text-span').map(el => {
    Polyfill.querySelectorAll(el, '.hide-when-compact, .collapsed').forEach(el => el.remove())
    return el
  })
}

/**
 * Extracts array of page issues HTML from element
 * @param {!Document} document
 * @return {!Array.<string>} Return empty array if nothing is extracted
 */
const collectPageIssuesHTML = document =>
  collectPageIssues(document).map(el => el.innerHTML.trim())

/**
 * Extracts array of page issues text from element
 * @param {!Document} document
 * @return {!Array.<string>} Return empty array if nothing is extracted
 */
const collectPageIssuesText = document =>
  collectPageIssues(document).map(el => el.textContent.trim())

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
  return Polyfill.querySelectorAll(element, 'div.hatnote').map(el => el.innerHTML.trim())
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