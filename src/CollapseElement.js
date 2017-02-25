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

export default {
  getTableHeader
}