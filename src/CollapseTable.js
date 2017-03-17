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
    header.classList.remove('app_table_collapse_close')
    header.classList.remove('app_table_collapse_icon')
    header.classList.add('app_table_collapsed_open')
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
    header.classList.remove('app_table_collapsed_open')
    header.classList.add('app_table_collapse_close')
    header.classList.add('app_table_collapse_icon')
    if (caption) {
      caption.style.visibility = 'hidden'
    }
    footer.style.display = 'block'
  }
}

export default {
  getTableHeader,
  toggleCollapseClickCallback
}