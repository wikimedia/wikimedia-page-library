import Polyfill from './Polyfill'

// todo: drop ancestor consideration and move to Polyfill.closest().
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
 * @param {?Element} element
 * @param {!string} property
 * @return {?Element} The inclusive first element with an inline style or undefined.
 */
const closestInlineStyle = (element, property) => {
  for (let el = element; el; el = el.parentElement) {
    if (el.style[property]) { return el }
  }
  return undefined
}

/**
 * Determines if element has a table ancestor.
 * @param  {!Element}  el   Element
 * @return {!boolean}       Whether table ancestor of 'el' is found
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
 * Copy existing attributes from source to destination as data-* attributes.
 * @param {!HTMLElement} source
 * @param {!HTMLElement} destination
 * @param {!Array.<string>} attributes
 * @return {void}
 */
const copyAttributesToDataAttributes = (source, destination, attributes) => {
  attributes.filter(attribute => source.hasAttribute(attribute))
    .forEach(attribute =>
      destination.setAttribute(`data-${attribute}`, source.getAttribute(attribute)))
}

/**
 * Copy existing data-* attributes from source to destination as attributes.
 * @param {!HTMLElement} source
 * @param {!HTMLElement} destination
 * @param {!Array.<string>} attributes
 * @return {void}
 */
const copyDataAttributesToAttributes = (source, destination, attributes) => {
  attributes.filter(attribute => source.hasAttribute(`data-${attribute}`))
    .forEach(attribute =>
      destination.setAttribute(attribute, source.getAttribute(`data-${attribute}`)))
}

export default {
  findClosestAncestor,
  isNestedInTable,
  closestInlineStyle,
  isVisible,
  copyAttributesToDataAttributes,
  copyDataAttributesToAttributes
}