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
 * @typedef {function} ShownReadMorePagesHandler
 * @param {!Object[]} pages
 * @param {!string} containerID
 * @param {SaveButtonClickHandler} saveButtonClickHandler
 * @param {TitlesShownHandler} titlesShownHandler
 * @param {!Document} document
 * @return {void}
 */

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
  let counter = 0
  const safeMaxTries = 30
  let stringToClean = string
  let previousString = ''
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
class ReadMorePage {
  /**
   * ReadMorePage constructor.
   * @param {!string} title
   * @param {?string} thumbnail
   * @param {?object} terms
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
 * Makes document fragment for a read more page.
 * @param {!ReadMorePage} readMorePage
 * @param {!number} index
 * @param {SaveButtonClickHandler} saveButtonClickHandler
 * @param {!Document} document
 * @return {!DocumentFragment}
 */  
const documentFragmentForReadMorePage = (readMorePage, index, saveButtonClickHandler, document) => {
  const outerAnchorContainer = document.createElement('a')
  outerAnchorContainer.id = index
  outerAnchorContainer.className = 'pagelib_footer_readmore_page'

  const hasImage = readMorePage.thumbnail && readMorePage.thumbnail.source
  if (hasImage) {
    const image = document.createElement('div')
    image.style.backgroundImage = `url(${readMorePage.thumbnail.source})`
    image.classList.add('pagelib_footer_readmore_page_image')
    outerAnchorContainer.appendChild(image)
  }

  const innerDivContainer = document.createElement('div')
  innerDivContainer.classList.add('pagelib_footer_readmore_page_container')
  outerAnchorContainer.appendChild(innerDivContainer)
  outerAnchorContainer.href = `/wiki/${encodeURI(readMorePage.title)}`

  if (readMorePage.title) {
    const title = document.createElement('div')
    title.id = index
    title.className = 'pagelib_footer_readmore_page_title'
    const displayTitle = readMorePage.title.replace(/_/g, ' ')
    title.innerHTML = displayTitle
    outerAnchorContainer.title = displayTitle
    innerDivContainer.appendChild(title)
  }

  let description
  if (readMorePage.terms) {
    description = readMorePage.terms.description[0]
  }
  if ((description === undefined || description.length < 10) && readMorePage.extract) {
    description = cleanExtract(readMorePage.extract)
  }
  if (description) {
    const descriptionEl = document.createElement('div')
    descriptionEl.id = index
    descriptionEl.className = 'pagelib_footer_readmore_page_description'
    descriptionEl.innerHTML = description
    innerDivContainer.appendChild(descriptionEl)
  }

  const saveButton = document.createElement('div')
  saveButton.id = `${_saveButtonIDPrefix}${encodeURI(readMorePage.title)}`
  saveButton.className = 'pagelib_footer_readmore_page_save'
  saveButton.addEventListener('click', event => {
    event.stopPropagation()
    event.preventDefault()
    saveButtonClickHandler(readMorePage.title)
  })
  innerDivContainer.appendChild(saveButton)

  return document.createDocumentFragment().appendChild(outerAnchorContainer)
}

/**
 * @type {ShownReadMorePagesHandler}
 */
const showReadMorePages = (pages, containerID, saveButtonClickHandler, titlesShownHandler,
  document) => {
  const shownTitles = []
  const container = document.getElementById(containerID)
  pages.forEach((page, index) => {
    const title = page.title.replace(/ /g, '_')
    shownTitles.push(title)
    const pageModel = new ReadMorePage(title, page.thumbnail, page.terms, page.extract)
    const pageFragment =
      documentFragmentForReadMorePage(pageModel, index, saveButtonClickHandler, document)
    container.appendChild(pageFragment)
  })
  titlesShownHandler(shownTitles)
}

/**
 * Makes 'Read more' query parameters object for a title.
 * @param {!string} title
 * @param {!number} count
 * @return {!object}
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
 * @param {!object} parameters
 * @return {!string}
 */
const stringFromQueryParameters = parameters => Object.keys(parameters)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
  .join('&')

/**
 * URL for retrieving 'Read more' pages for a given title.
 * Leave 'baseURL' null if you don't need to deal with proxying.
 * @param {!string} title
 * @param {!number} count Number of `Read more` items to fetch for this title
 * @param {?string} baseURL
 * @return {!sring}
 */
const readMoreQueryURL = (title, count, baseURL) =>
  `${baseURL || ''}/w/api.php?${stringFromQueryParameters(queryParameters(title, count))}`

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
 * Fetches 'Read more' pages.
 * @param {!string} title
 * @param {!number} count
 * @param {!string} containerID
 * @param {?string} baseURL
 * @param {ShownReadMorePagesHandler} showReadMorePagesHandler
 * @param {SaveButtonClickHandler} saveButtonClickHandler
 * @param {TitlesShownHandler} titlesShownHandler
 * @param {!Document} document
 * @return {void}
 */
const fetchReadMore = (title, count, containerID, baseURL, showReadMorePagesHandler,
  saveButtonClickHandler, titlesShownHandler, document) => {
  const xhr = new XMLHttpRequest() // eslint-disable-line no-undef
  xhr.open('GET', readMoreQueryURL(title, count, baseURL), true)
  xhr.onload = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) { // eslint-disable-line no-undef
      if (xhr.status === 200) {
        showReadMorePagesHandler(
          JSON.parse(xhr.responseText).query.pages,
          containerID,
          saveButtonClickHandler,
          titlesShownHandler,
          document
        )
      } else {
        fetchErrorHandler(xhr.statusText)
      }
    }
  }
  xhr.onerror = e => {
    fetchErrorHandler(xhr.statusText)
  }
  xhr.send()
}

/**
 * Updates save button bookmark icon for saved state.
 * @param {!HTMLDivElement} button
 * @param {!boolean} isSaved
 * @return {void}
 */
const updateSaveButtonBookmarkIcon = (button, isSaved) => {
  const unfilledClass = 'pagelib_footer_readmore_bookmark_unfilled'
  const filledClass = 'pagelib_footer_readmore_bookmark_filled'
  button.classList.remove(unfilledClass)
  button.classList.remove(filledClass)
  button.classList.add(isSaved ? filledClass : unfilledClass)
}

/**
 * Updates save button text and bookmark icon for saved state.
 * @param {!string} title
 * @param {!string} text
 * @param {!boolean} isSaved
 * @param {!Document} document
 * @return {void}
*/
const updateSaveButtonForTitle = (title, text, isSaved, document) => {
  const saveButton = document.getElementById(`${_saveButtonIDPrefix}${title}`)
  saveButton.innerText = text
  saveButton.title = text
  updateSaveButtonBookmarkIcon(saveButton, isSaved)
}

/**
 * Adds 'Read more' for 'title' to 'containerID' element.
 * Leave 'baseURL' null if you don't need to deal with proxying.
 * @param {!string} title
 * @param {!number} count
 * @param {!string} containerID
 * @param {?string} baseURL
 * @param {SaveButtonClickHandler} saveButtonClickHandler
 * @param {TitlesShownHandler} titlesShownHandler
 * @param {!Document} document
 * @return {void}
 */
const add = (title, count, containerID, baseURL, saveButtonClickHandler, titlesShownHandler,
  document) => {
  fetchReadMore(
    title,
    count,
    containerID,
    baseURL,
    showReadMorePages,
    saveButtonClickHandler,
    titlesShownHandler,
    document
  )
}

/**
 * Sets heading element string.
 * @param {!string} headingString
 * @param {!string} headingID
 * @param {!Document} document
 * @return {void}
 */
const setHeading = (headingString, headingID, document) => {
  const headingElement = document.getElementById(headingID)
  headingElement.innerText = headingString
  headingElement.title = headingString
}

export default {
  add,
  setHeading,
  updateSaveButtonForTitle
}