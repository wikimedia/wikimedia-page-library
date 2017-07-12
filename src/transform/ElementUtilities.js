import Polyfill from './Polyfill'

/**
 * Returns closest ancestor of element which matches selector.
 * Similar to 'closest' methods as seen here:
 *  https://api.jquery.com/closest/
 *  https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
 * @param  {!Element} el        Element
 * @param  {!string} selector   Selector to look for in ancestors of 'el'
 * @return {?HTMLElement}       Closest ancestor of 'el' matching 'selector'
 */
const findClosestAncestor = (el, selector) => {
  let parentElement
  for (parentElement = el.parentElement;
    parentElement && !Polyfill.matchesSelector(parentElement, selector);
    parentElement = parentElement.parentElement) {
    // Intentionally empty.
  }
  return parentElement
}

/**
 * Determines if element has a table ancestor.
 * @param  {!Element}  el   Element
 * @return {boolean}        Whether table ancestor of 'el' is found
 */
const isNestedInTable = el => Boolean(findClosestAncestor(el, 'table'))

/**
 * @param {!HTMLElement} element
 * @return {!boolean} true if element affects layout, false otherwise.
 */
const isVisible = element =>
  // https://github.com/jquery/jquery/blob/305f193/src/css/hiddenVisibleSelectors.js#L12
  Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length)

/**
 * Move attributes from source to destination as data-* attributes.
 * @param {!HTMLElement} source
 * @param {!HTMLElement} destination
 * @param {!string[]} attributes
 * @return {void}
 */
const moveAttributesToDataAttributes = (source, destination, attributes) => {
  attributes.forEach(attribute => {
    if (source.hasAttribute(attribute)) {
      destination.setAttribute(`data-${attribute}`, source.getAttribute(attribute))
      source.removeAttribute(attribute)
    }
  })
}

/**
 * Move data-* attributes from source to destination as attributes.
 * @param {!HTMLElement} source
 * @param {!HTMLElement} destination
 * @param {!string[]} attributes
 * @return {void}
 */
const moveDataAttributesToAttributes = (source, destination, attributes) => {
  attributes.forEach(attribute => {
    const dataAttribute = `data-${attribute}`
    if (source.hasAttribute(dataAttribute)) {
      destination.setAttribute(attribute, source.getAttribute(dataAttribute))
      source.removeAttribute(dataAttribute)
    }
  })
}

/**
 * Copy data-* attributes from source to destination as attributes.
 * @param {!HTMLElement} source
 * @param {!HTMLElement} destination
 * @param {!string[]} attributes
 * @return {void}
 */
const copyDataAttributesToAttributes = (source, destination, attributes) => {
  attributes.forEach(attribute => {
    const dataAttribute = `data-${attribute}`
    if (source.hasAttribute(dataAttribute)) {
      destination.setAttribute(attribute, source.getAttribute(dataAttribute))
    }
  })
}

export default {
  findClosestAncestor,
  isNestedInTable,
  isVisible,
  moveAttributesToDataAttributes,
  moveDataAttributesToAttributes,
  copyDataAttributesToAttributes
}