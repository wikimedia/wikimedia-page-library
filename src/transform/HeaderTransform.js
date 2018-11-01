import './HeaderTransform.css'
import EditTransform from './EditTransform.js'

/**
 * Makes an SVG element.
 * @param {!Document} document
 * @param {!number} width
 * @param {!number}height
 * @param {!string} svgContents
 * @return {!Element}
 */
const makeSvgElement = (document, width, height, svgContents) => {
  const svg = document.createElement('svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)
  svg.innerHTML = svgContents
  return svg
}

/**
 * Makes the audio "speaker" icon for the pronunciation of the page title
 * @param {!Document} document
 * @return {!Element}
 */
const makePronunciationIcon = document => {
  const audioIcon = makeSvgElement(document, 16, 16,
    // eslint-disable-next-line max-len
    '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path><path d="M0 0h24v24H0z" fill="none"></path>')
  audioIcon.setAttribute('viewBox', '0 0 24 24')
  audioIcon.style.margin = '0 6px 2px 6px'
  const audioAnchor = document.createElement('a')
  audioAnchor.setAttribute('data-action', 'pronunciation_click')
  audioAnchor.setAttribute('class', 'pagelib_header_pronunciation')
  audioAnchor.setAttribute('style', 'color:inherit;')
  audioAnchor.innerHTML = audioIcon.outerHTML
  return audioAnchor
}

/**
 * Makes a div including whatever is needed to display the description and edit button.
 * @param {!Document} document
 * @param {boolean} isDescriptionEditable
 * @param {?string} description
 * @param {!string} stringAddDescription for I18N
 * @return {!Element}
 */
const makeDescriptionDiv = (document, isDescriptionEditable, description, stringAddDescription) => {
  const descriptionDiv = document.createElement('div')
  const editButton = EditTransform.newEditSectionButton(document, 0)
  const mainEditPencilAnchor = editButton.querySelector('a')
  if (isDescriptionEditable) {
    mainEditPencilAnchor.setAttribute('data-action', 'edit_main')
  }

  // Span that will contain the description and/or the two-line icon
  const descriptionSpan = document.createElement('span')
  descriptionSpan.setAttribute('class', 'pagelib_header_description')
  if (description) {
    descriptionSpan.innerHTML = description
  } else if (isDescriptionEditable) {
    const descriptionAnchor = document.createElement('a')
    const descSvg = makeSvgElement(document, 24, 16,
      // eslint-disable-next-line max-len
      '<defs><path id="a" d="M0 0h24v24H0V0z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path d="M4 9h16v2H4zm0 4h10v2H4z" clip-path="url(#b)"/>')
    descSvg.setAttribute('viewBox', '4 9 24 8')
    descriptionAnchor.setAttribute('href', '#')
    descriptionAnchor.setAttribute('data-action', 'edit_description')
    descriptionAnchor.innerHTML = descSvg.outerHTML + stringAddDescription
    descriptionSpan.appendChild(descriptionAnchor)
  } else {
    descriptionSpan.innerHTML = ' '
  }
  descriptionDiv.appendChild(descriptionSpan)
  descriptionDiv.appendChild(editButton)
  return descriptionDiv
}

/**
 * Adds page header with title, pronunciation button, and description.
 * @param {!Document} document
 * @param {!Element} container
 * @param {!string} displayTitle
 * @param {boolean} descriptionEditable
 * @param {?string} description
 * @param {!string} stringAddDescription for I18N
 * @param {?boolean} hasPronunciation
 * @param {?boolean} isMainPage
 * @param {?boolean} isRtl
 * @return {void}
 */
const add = (document, container, displayTitle, descriptionEditable, description,
  stringAddDescription, hasPronunciation, isMainPage, isRtl) => {

  const titleDiv = document.createElement('div')
  titleDiv.id = 'heading_0'
  titleDiv.setAttribute('data-id', 0)
  titleDiv.className = 'section_heading pagelib_header'
  titleDiv.setAttribute('dir', isRtl ? 'rtl' : 'ltr')

  // Create the actual H1 heading
  const h1 = document.createElement('h1')
  h1.innerHTML = displayTitle

  if (hasPronunciation) {
    h1.appendChild(makePronunciationIcon(document))
  }

  // Div that will contain the description and edit pencil
  const descriptionDiv = makeDescriptionDiv(document, descriptionEditable,
    description, stringAddDescription)

  // Decorative divider that appears below the title and description
  const dividerLine = document.createElement('div')
  dividerLine.setAttribute('class', 'pagelib_header_divider')

  if (!isMainPage) {
    titleDiv.appendChild(h1)
    titleDiv.appendChild(descriptionDiv)
    titleDiv.appendChild(dividerLine)
  }
  container.appendChild(titleDiv)
}

/** */
export default {
  add
}