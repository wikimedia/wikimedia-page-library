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
  return Polyfill.querySelectorAll(document, '.mbox-text-span').map(element => {
    Polyfill.querySelectorAll(element, '.hide-when-compact, .collapsed').forEach(el => el.remove())
    return element
  })
}

/**
 * Returns section JSON for an element
 * @param {!Element} element
 * @return {!map} section info
 */
const sectionJSON = element => {
  const section = element.closest('section[data-mw-section-id]')
  const headerEl = section && section.querySelector('h1,h2,h3,h4,h5,h6')
  return {
    id: section && parseInt(section.getAttribute('data-mw-section-id'), 10),
    title: headerEl && headerEl.innerHTML.trim(),
    anchor: headerEl && headerEl.getAttribute('id')
  }
}

/**
 * Extracts array of page issues from element
 * @param {!Document} document
 * @return {!Array.<Object>} Return empty array if nothing is extracted
 */
const collectPageIssuesJSON = document =>
  collectPageIssues(document).map(el => ({
    html: el.innerHTML.trim(),
    section: sectionJSON(el)
  })
  )

/**
 * Extracts array of page issues HTML from element
 * @param {!Document} document
 * @return {!Array.<string>} Return empty array if nothing is extracted
 */
const collectPageIssuesHTML = document =>
  collectPageIssues(document).map(el => el.element.innerHTML.trim())

/**
 * Extracts array of page issues text from element
 * @param {!Document} document
 * @return {!Array.<string>} Return empty array if nothing is extracted
 */
const collectPageIssuesText = document =>
  collectPageIssues(document).map(el => el.element.textContent.trim())

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

/**
 * Extracts array of disambiguation items from an element
 * @param {?Element} element
 * @return {!Array.<Object>} Return empty array if nothing is extracted
 */
const collectDisambiguationJSON = element => {
  if (!element) {
    return []
  }
  return Polyfill.querySelectorAll(element, 'div.hatnote').map(element => {
    const titles = Polyfill
      .querySelectorAll(element, 'div.hatnote a[href]:not([href=""]):not([redlink="1"])')
      .map(el => el.href)
    return {
      html: element.innerHTML.trim(),
      links: titles,
      section: sectionJSON(element)
    }
  })
}

export default {
  collectDisambiguationHTML,
  collectDisambiguationJSON,
  collectDisambiguationTitles,
  collectPageIssuesHTML,
  collectPageIssuesJSON,
  collectPageIssuesText,
  test: {
    collectPageIssues
  }
}