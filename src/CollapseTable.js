import elementUtilities from './ElementUtilities'

/**
 * Find an array of table header (TH) contents. If there are no TH elements in
 * the table or the header's link matches pageTitle, an empty array is returned.
 * @param {!Element} element
 * @param {?string} pageTitle
 * @return {!Array<string>}
 */
const getTableHeader = (element, pageTitle) => {
  let thArray = []

  if (element.children === undefined || element.children === null) {
    return thArray
  }

  for (let i = 0; i < element.children.length; i++) {
    const el = element.children[i]

    if (el.tagName === 'TH') {
      // ok, we have a TH element!
      // However, if it contains more than two links, then ignore it, because
      // it will probably appear weird when rendered as plain text.
      const aNodes = el.querySelectorAll('a')
      if (aNodes.length < 3) {
        // todo: remove nonstandard Element.innerText usage
        // Also ignore it if it's identical to the page title.
        if ((el.innerText && el.innerText.length || el.textContent.length) > 0
                && el.innerText !== pageTitle && el.textContent !== pageTitle
                && el.innerHTML !== pageTitle) {
          thArray.push(el.innerText || el.textContent)
        }
      }
    }

    // if it's a table within a table, don't worry about it
    if (el.tagName === 'TABLE') {
      continue
    }

    // recurse into children of this element
    const ret = getTableHeader(el, pageTitle)

    // did we get a list of TH from this child?
    if (ret.length > 0) {
      thArray = thArray.concat(ret)
    }
  }

  return thArray
}

/** Ex: toggleCollapseClickCallback.bind(el, (container) => {
          window.scrollTo(0, container.offsetTop - transformer.getDecorOffset())
        })
    @this HTMLElement
    @param bottomDivClickCallback {!(!HTMLElement) => void}
    @return {void} */
const toggleCollapseClickCallback = function(bottomDivClickCallback) {
  const container = this.parentNode // eslint-disable-line no-invalid-this
  const header = container.children[0]
  const table = container.children[1]
  const footer = container.children[2]
  const caption = header.querySelector('.app_table_collapsed_caption')
  if (table.style.display !== 'none') {
    table.style.display = 'none'
    header.classList.remove('app_table_collapse_close') // todo: use app_table_collapsed_collapsed
    header.classList.remove('app_table_collapse_icon') // todo: use app_table_collapsed_icon
    header.classList.add('app_table_collapsed_open') // todo: use app_table_collapsed_expanded
    if (caption) {
      caption.style.visibility = 'visible'
    }
    footer.style.display = 'none'
        // if they clicked the bottom div, then scroll back up to the top of the table.
    if (this === footer) { // eslint-disable-line no-invalid-this
      bottomDivClickCallback(container)
    }
  } else {
    table.style.display = 'block'
    header.classList.remove('app_table_collapsed_open') // todo: use app_table_collapsed_expanded
    header.classList.add('app_table_collapse_close') // todo: use app_table_collapsed_collapsed
    header.classList.add('app_table_collapse_icon') // todo: use app_table_collapsed_icon
    if (caption) {
      caption.style.visibility = 'hidden'
    }
    footer.style.display = 'block'
  }
}

/**
 * @param {!HTMLElement} table
 * @return {!boolean} true if table should be collapsed, false otherwise.
 */
const shouldTableBeCollapsed = (table) => {
  const classBlacklist = ['navbox', 'vertical-navbox', 'navbox-inner', 'metadata', 'mbox-small']
  const blacklistIntersects = classBlacklist.some((clazz) => table.classList.contains(clazz))
  return table.style.display !== 'none' && !blacklistIntersects
}

/**
 * @param {!Element} element
 * @return {!boolean} true if element is an infobox, false otherwise.
 */
const isInfobox = (element) => {
  return element.classList.contains('infobox')
}

/**
 * @param {!Document} document
 * @param {?string} content HTML string.
 * @return {!HTMLDivElement}
 */
const newCollapsedHeaderDiv = (document, content) => {
  const div = document.createElement('div')
  div.classList.add('app_table_collapsed_container')
  div.classList.add('app_table_collapsed_open')
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
  div.classList.add('app_table_collapsed_bottom')
  div.classList.add('app_table_collapse_icon') // todo: use collapsed everywhere
  div.innerHTML = content || ''
  return div
}

/**
 * @param {!string} title
 * @param {!string[]} headerText
 * @return {!string} HTML string.
 */
const newCaption = (title, headerText) => {
  let caption = `<strong>${title}</strong>`

  caption += '<span class=app_span_collapse_text>'
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

// todo: use consistent terminology -- collapsed and expanded; not hidden, visible, open, and closed
/**
 * @param {!Document} document
 * @param {!Element} content
 * @param {?string} pageTitle
 * @param {?boolean} isMainPage
 * @param {?string} infoboxTitle
 * @param {?string} otherTitle
 * @param {?string} footerTitle
 * @return {void}
 */
const hideTables = (document, content, pageTitle, isMainPage, infoboxTitle, otherTitle,
  footerTitle) => {
  if (isMainPage) { return }

  const tables = content.querySelectorAll('table')
  for (let i = 0; i < tables.length; ++i) {
    const table = tables[i]

    if (elementUtilities.findClosest(table, '.app_table_container')
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
    const containerDiv = document.createElement('div')
    containerDiv.className = 'app_table_container'
    table.parentNode.insertBefore(containerDiv, table)
    table.parentNode.removeChild(table)

    // remove top and bottom margin from the table, so that it's flush with
    // our expand/collapse buttons
    table.style.marginTop = '0px'
    table.style.marginBottom = '0px'

    const collapsedHeaderDiv = newCollapsedHeaderDiv(document, caption)
    collapsedHeaderDiv.style.display = 'block'

    const collapsedFooterDiv = newCollapsedFooterDiv(document, footerTitle)
    collapsedFooterDiv.style.display = 'none'

    // add our stuff to the container
    containerDiv.appendChild(collapsedHeaderDiv)
    containerDiv.appendChild(table)
    containerDiv.appendChild(collapsedFooterDiv)

    // set initial visibility
    table.style.display = 'none'

    // assign click handler to the collapsed divs
    collapsedHeaderDiv.onclick = toggleCollapseClickCallback.bind(collapsedHeaderDiv)
    collapsedFooterDiv.onclick = toggleCollapseClickCallback.bind(collapsedHeaderDiv)
  }
}

export default {
  toggleCollapseClickCallback,
  hideTables,
  test: {
    getTableHeader,
    shouldTableBeCollapsed,
    isInfobox,
    newCollapsedHeaderDiv,
    newCollapsedFooterDiv,
    newCaption
  }
}