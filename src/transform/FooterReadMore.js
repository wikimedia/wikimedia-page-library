import './FooterReadMore.css'

/**
 * @typedef {function} SaveButtonClickHandler
 * @param {!string} title
 * @return {void}
 */

/**
  * @typedef {function} TitlesShownHandler
  * @param {!string[]} titles
  * @return {void}
  */

/**
   * Display fetched read more pages.
   * @typedef {function} ShownReadMoreHandler
   * @param {!Object[]} pages
   * @param {!Document} document
   * @param {!string} containerID
   * @param {SaveButtonClickHandler} saveButtonClickHandler
   * @param {TitlesShownHandler} titlesShownHandler
   * @return {void}
   */

let _saveForLaterString = null
let _savedForLaterString = null
const _saveButtonIDPrefix = 'readmore:save:'

/**
 * Removes parenthetical enclosures from string. 
 * @param {!string} string
 * @param {!string} opener
 * @param {!string} closer
 * @return {!string}
 */
const safelyRemoveEnclosures = (string, opener, closer) => {
  const enclosureRegex = new RegExp(`\\s?[${opener}][^${opener}${closer}]+[${closer}]`, 'g')
  let previousString = null
  let counter = 0
  const safeMaxTries = 30
  let stringToClean = string
  do {
    previousString = stringToClean
    stringToClean = stringToClean.replace(enclosureRegex, '')
    counter++
  } while (previousString !== stringToClean && counter < safeMaxTries)
  return stringToClean
}

/**
 * Removes '(...)' and '/.../' parenthetical enclosures from string. 
 * @param {!string} string
 * @return {!string}
 */
const cleanExtract = string => {
  let stringToClean = string
  stringToClean = safelyRemoveEnclosures(stringToClean, '(', ')')
  stringToClean = safelyRemoveEnclosures(stringToClean, '/', '/')
  return stringToClean
}

/**
 * Read more page model.
 */
class WMFPage {
  /**
   * WMFPage constructor.
   * @param {!string} title
   * @param {?string} thumbnail
   * @param {?Object} terms
   * @param {?string} extract
   * @return {void}
   */
  constructor(title, thumbnail, terms, extract) {
    this.title = title
    this.thumbnail = thumbnail
    this.terms = terms
    this.extract = extract
  }
}

/**
 * Read more page fragment model.
 */
class WMFPageFragment {
  /**
   * WMFPageFragment constructor.
   * @param {!WMFPage} wmfPage
   * @param {!number} index
   * @param {!Document} document
   * @param {SaveButtonClickHandler} saveButtonClickHandler
   * @return {!DocumentFragment}
   */
  constructor(wmfPage, index, document, saveButtonClickHandler) {

    const outerAnchorContainer = document.createElement('a')
    outerAnchorContainer.id = index
    outerAnchorContainer.className = 'pagelib_footer_readmore_page'

    const hasImage = wmfPage.thumbnail && wmfPage.thumbnail.source
    if (hasImage) {
      const image = document.createElement('div')
      image.style.backgroundImage = `url(${wmfPage.thumbnail.source})`
      image.classList.add('pagelib_footer_readmore_page_image')
      outerAnchorContainer.appendChild(image)
    }

    const innerDivContainer = document.createElement('div')
    innerDivContainer.classList.add('pagelib_footer_readmore_page_container')
    outerAnchorContainer.appendChild(innerDivContainer)
    outerAnchorContainer.href = `/wiki/${encodeURI(wmfPage.title)}`

    if (wmfPage.title) {
      const title = document.createElement('div')
      title.id = index
      title.className = 'pagelib_footer_readmore_page_title'
      const displayTitle = wmfPage.title.replace(/_/g, ' ')
      title.innerHTML = displayTitle
      outerAnchorContainer.title = displayTitle
      innerDivContainer.appendChild(title)
    }

    let description = null
    if (wmfPage.terms) {
      description = wmfPage.terms.description[0]
    }
    if ((description === null || description.length < 10) && wmfPage.extract) {
      description = cleanExtract(wmfPage.extract)
    }
    if (description) {
      const descriptionEl = document.createElement('div')
      descriptionEl.id = index
      descriptionEl.className = 'pagelib_footer_readmore_page_description'
      descriptionEl.innerHTML = description
      innerDivContainer.appendChild(descriptionEl)
    }

    const saveButton = document.createElement('div')
    saveButton.id = `${_saveButtonIDPrefix}${encodeURI(wmfPage.title)}`
    saveButton.innerText = _saveForLaterString
    saveButton.title = _saveForLaterString
    saveButton.className = 'pagelib_footer_readmore_page_save'
    saveButton.addEventListener('click', event => {
      event.stopPropagation()
      event.preventDefault()
      saveButtonClickHandler(wmfPage.title)
    }, false)
    innerDivContainer.appendChild(saveButton)

    return document.createDocumentFragment().appendChild(outerAnchorContainer)
  }
}

/**
 * @type {ShownReadMoreHandler}
 */
const showReadMore = (pages, document, containerID, saveButtonClickHandler, titlesShownHandler) => {
  const shownTitles = []
  const container = document.getElementById(containerID)
  pages.forEach((page, index) => {
    const title = page.title.replace(/ /g, '_')
    shownTitles.push(title)
    const pageModel = new WMFPage(title, page.thumbnail, page.terms, page.extract)
    const pageFragment = new WMFPageFragment(pageModel, index, document, saveButtonClickHandler)
    container.appendChild(pageFragment)
  })
  titlesShownHandler(shownTitles)
}

/**
 * Makes 'Read more' query parameters object for a title.
 * @param {!string} title
 * @param {!number} count
 * @return {!Object}
 */
const queryParameters = (title, count) => ({
  action: 'query',
  continue: '',
  exchars: 256,
  exintro: 1,
  exlimit: count,
  explaintext: '',
  format: 'json',
  generator: 'search',
  gsrinfo: '',
  gsrlimit: count,
  gsrnamespace: 0,
  gsroffset: 0,
  gsrprop: 'redirecttitle',
  gsrsearch: `morelike:${title}`,
  gsrwhat: 'text',
  ns: 'ppprop',
  pilimit: count,
  piprop: 'thumbnail',
  pithumbsize: 120,
  prop: 'pageterms|pageimages|pageprops|revisions|extracts',
  rrvlimit: 1,
  rvprop: 'ids',
  wbptterms: 'description',
  formatversion: 2
})

/**
 * Converts query parameter object to string.
 * @param {!Object} parameters
 * @return {!string}
 */
const stringFromQueryParameters = parameters => Object.keys(parameters)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
  .join('&')

/**
 * URL for retrieving 'Read more' items for a given title.
 * @param {!string} title
 * @param {?string} baseURL
 * @return {!sring}
 */
const readMoreQueryURL = (title, baseURL) => {
  const readMoreItemFetchCount = 3
  const readMoreQueryParameterString = stringFromQueryParameters(
    queryParameters(title, readMoreItemFetchCount)
  )
  let baseURLToUse = baseURL
  if (baseURLToUse === null) {
    baseURLToUse = ''
  }
  return `${baseURLToUse}/w/api.php?${readMoreQueryParameterString}`
}

/**
 * Fetch error handler.
 * @param {!string} statusText
 * @return {void}
 */
const fetchErrorHandler = statusText => {
  // TODO: figure out if we want to hide the 'Read more' header in cases when fetch fails.
  // console.log(`statusText = ${statusText}`);
}

/**
 * Fetches 'Read more' items.
 * @param {?string} baseURL Leave 'baseURL' null if you don't need to deal with proxying.
 * @param {!string} title
 * @param {ShownReadMoreHandler} showReadMoreHandler
 * @param {!string} containerID
 * @param {SaveButtonClickHandler} saveButtonClickHandler
 * @param {TitlesShownHandler} titlesShownHandler
 * @param {!Document} document
 * @return {void}
 */
const fetchReadMore = (baseURL, title, showReadMoreHandler, containerID, saveButtonClickHandler,
  titlesShownHandler, document) => {
  const xhr = new XMLHttpRequest() // eslint-disable-line no-undef
  xhr.open('GET', readMoreQueryURL(title, baseURL), true)
  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        showReadMoreHandler(JSON.parse(xhr.responseText).query.pages, document, containerID,
          saveButtonClickHandler, titlesShownHandler)
      } else {
        fetchErrorHandler(xhr.statusText)
      }
    }
  }
  xhr.onerror = function(e) {
    fetchErrorHandler(xhr.statusText)
  }
  xhr.send(null)
}

/**
 * Updates save button text for saved state.
 * @param {!HTMLDivElement} button
 * @param {!string} title
 * @param {!Boolean} isSaved
 * @return {void}
 */
const updateSaveButtonText = (button, title, isSaved) => {
  const text = isSaved ? _savedForLaterString : _saveForLaterString
  button.innerText = text
  button.title = text
}

/**
 * Updates save button bookmark icon for saved state.
 * @param {!HTMLDivElement} button
 * @param {!string} title
 * @param {!Boolean} isSaved
 * @return {void}
 */
const updateSaveButtonBookmarkIcon = (button, title, isSaved) => {
  const unfilledClass = 'pagelib_footer_readmore_bookmark_unfilled'
  const filledClass = 'pagelib_footer_readmore_bookmark_filled'
  button.classList.remove(unfilledClass)
  button.classList.remove(filledClass)
  button.classList.add(isSaved ? filledClass : unfilledClass)
}

/**
 * Updates save button text and bookmark icon for saved state.
 * @param {!string} title
 * @param {!Boolean} isSaved
 * @param {!Document} document
 * @return {void}
*/
const setTitleIsSaved = (title, isSaved, document) => {
  const saveButton = document.getElementById(`${_saveButtonIDPrefix}${title}`)
  updateSaveButtonText(saveButton, title, isSaved)
  updateSaveButtonBookmarkIcon(saveButton, title, isSaved)
}

/**
 * Adds 'Read more' to 'containerID' element.
 * @param {!Document} document
 * @param {?string} baseURL
 * @param {!string} title
 * @param {!string} saveForLaterString
 * @param {!string} savedForLaterString
 * @param {!string} containerID
 * @param {SaveButtonClickHandler} saveButtonClickHandler
 * @param {TitlesShownHandler} titlesShownHandler
 */
const add = (document, baseURL, title, saveForLaterString, savedForLaterString, containerID,
  saveButtonClickHandler, titlesShownHandler) => {
  _saveForLaterString = saveForLaterString
  _savedForLaterString = savedForLaterString
  fetchReadMore(
    baseURL, title, showReadMore, containerID, saveButtonClickHandler, titlesShownHandler, document
  )
}

/**
 * Sets heading element string.
 * @param {!string} headingString
 * @param {!string} headingID
 * @param {!Document} document
 */
const setHeading = (headingString, headingID, document) => {
  const headingElement = document.getElementById(headingID)
  headingElement.innerText = headingString
  headingElement.title = headingString
}

export default {
  setHeading,
  setTitleIsSaved,
  add
}