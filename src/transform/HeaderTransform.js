const OPACITY_LIGHT = 0.54
const OPACITY_DARK = 0.7

/**
 * Makes an SVG element.
 * @param {!Document} document
 * @param {!number} width
 * @param {!number}height
 * @param {!string} color
 * @param {!string} svgContents
 * @return {!Element}
 */
const makeSvgElement = (document, width, height, color, svgContents) => {
  const svg = document.createElement('svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)
  svg.setAttribute('style', `vertical-align:middle;fill:${color};`)
  svg.innerHTML = svgContents
  return svg
}

/**
 * Add header with title, pronunciation button, and description.
 * @param {!Document} document
 * @param {!Element} container
 * @param {!string} displayTitle
 * @param {boolean} descriptionEditable
 * @param {?string} description
 * @param {!string} stringAddDescription for I18N
 * @param {boolean} hasPronunciation
 * @param {boolean} isMainPage
 * @param {boolean} isRtl
 * @param {boolean} isDarkMode
 * @return {void}
 */
const add = (document, container, displayTitle, descriptionEditable, description,
  stringAddDescription, hasPronunciation, isMainPage, isRtl, isDarkMode) => {

  const titleDiv = document.createElement('div')
  titleDiv.id = 'heading_0'
  titleDiv.setAttribute('data-id', 0)
  titleDiv.className = 'section_heading'
  titleDiv.setAttribute('dir', isRtl ? 'rtl' : 'ltr')

  // Create the actual H1 heading
  const h1 = document.createElement('h1')
  h1.innerHTML = displayTitle

  if (hasPronunciation) {
    // Create and append the audio "speaker" icon
    const audioIcon = makeSvgElement(document, 16, 16, 'currentColor',
      // eslint-disable-next-line max-len
      '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path><path d="M0 0h24v24H0z" fill="none"></path>')
    audioIcon.setAttribute('viewBox', '0 0 24 24')
    audioIcon.style.margin = '0 6px 2px 6px'
    if (isRtl) {
      audioIcon.style.transform = 'scaleX(-1)'
    }
    const audioAnchor = document.createElement('a')
    audioAnchor.setAttribute('data-action', 'pronunciation_click')
    audioAnchor.setAttribute('style', 'color:inherit;')
    audioAnchor.innerHTML = audioIcon.outerHTML
    h1.appendChild(audioAnchor)
  }

  // Div that will contain the description and edit pencil
  const descriptionDiv = document.createElement('div')
  const mainEditPencilAnchor = document.createElement('a')
  mainEditPencilAnchor.setAttribute('data-action', 'edit_main')
  mainEditPencilAnchor.setAttribute('class', 'pagelib_edit_section_link')
  let style = isDarkMode ? 'filter:invert(100%);-webkit-filter:invert(100%);' : ''
  style += isRtl ? 'float:left;transform:scaleX(-1);' : 'float:right;'
  mainEditPencilAnchor.setAttribute('style', style)
  mainEditPencilAnchor.style.opacity = isDarkMode ? OPACITY_DARK : OPACITY_LIGHT

  // Span that will contain the description and/or the two-line icon
  const descriptionSpan = document.createElement('span')
  descriptionSpan.setAttribute('style', 'font-size:90%;')
  if (description) {
    descriptionSpan.innerHTML = description
    descriptionSpan.style.opacity = isDarkMode ? OPACITY_DARK : OPACITY_LIGHT
  } else if (descriptionEditable) {
    const descriptionAnchor = document.createElement('a')
    const descSvg = makeSvgElement(document, 24, 16, 'currentColor',
      // eslint-disable-next-line max-len
      '<defs><path id="a" d="M0 0h24v24H0V0z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path d="M4 9h16v2H4zm0 4h10v2H4z" clip-path="url(#b)"/>')
    descSvg.setAttribute('viewBox', '4 9 24 8')
    if (isRtl) {
      descSvg.style.transform = 'scaleX(-1)'
    }
    descriptionAnchor.setAttribute('href', '#')
    descriptionAnchor.setAttribute('data-action', 'edit_description')
    descriptionAnchor.innerHTML = descSvg.outerHTML + stringAddDescription
    descriptionAnchor.setAttribute('style', 'font-style:italic;')
    descriptionSpan.appendChild(descriptionAnchor)
  } else {
    descriptionSpan.innerHTML = ' '
  }

  // Decorative divider that appears below the title and description
  const dividerLine = document.createElement('div')
  dividerLine.setAttribute('style',
    'width:56px;border-top: 1px solid currentColor !important;margin-top:12px;margin-bottom:16px;')
  dividerLine.style.opacity = isDarkMode ? OPACITY_DARK : OPACITY_LIGHT

  descriptionDiv.appendChild(mainEditPencilAnchor)
  descriptionDiv.appendChild(descriptionSpan)
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