/**
  Tries to get an array of table header (TH) contents from a given table. If
  there are no TH elements in the table, an empty array is returned.
  @param {!Element} element Table or blob of HTML containing a table?
  @param {?string} pageTitle
  @return {!Array<string>}
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

/** @this HTMLElement
    @param bottomDivClickCallback {!(!HTMLElement) => void}
    @return {void} */
const toggleCollapseClickCallback = function(bottomDivClickCallback) {
  const container = this.parentNode // eslint-disable-line no-invalid-this
  const divCollapsed = container.children[0]
  const tableFull = container.children[1]
  const divBottom = container.children[2]
  const caption = divCollapsed.querySelector('.app_table_collapsed_caption')
  if (tableFull.style.display !== 'none') {
    tableFull.style.display = 'none'
    divCollapsed.classList.remove('app_table_collapse_close')
    divCollapsed.classList.remove('app_table_collapse_icon')
    divCollapsed.classList.add('app_table_collapsed_open')
    if (caption) {
      caption.style.visibility = 'visible'
    }
    divBottom.style.display = 'none'
        // if they clicked the bottom div, then scroll back up to the top of the table.
    if (this === divBottom) { // eslint-disable-line no-invalid-this
      bottomDivClickCallback(container)
    }
  } else {
    tableFull.style.display = 'block'
    divCollapsed.classList.remove('app_table_collapsed_open')
    divCollapsed.classList.add('app_table_collapse_close')
    divCollapsed.classList.add('app_table_collapse_icon')
    if (caption) {
      caption.style.visibility = 'hidden'
    }
    divBottom.style.display = 'block'
  }
}

// eslint-disable-next-line no-unused-vars
const handleTableCollapseOrExpandClickTmp = () => {
  handleTableCollapseOrExpandClick((container) => {
    // eslint-disable-next-line no-undef
    window.scrollTo(0, container.offsetTop - transformer.getDecorOffset())
  })
}

export default {
  getTableHeader,
  toggleCollapseClickCallback
}