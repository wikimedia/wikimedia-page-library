/**
 * Returns closest ancestor of element which matches selector.
 * Similar to 'closest' methods as seen here:
 *  https://api.jquery.com/closest/
 *  https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
 * @param  {!HTMLElement} el    Element
 * @param  {!string} selector   Selector to look for in ancestors of 'el'
 * @return {?HTMLElement}       Closest ancestor of 'el' matching 'selector'
 */
const findClosest = (el, selector) => {
  while ((el = el.parentElement) && !el.matches(selector)) {
    // Intentionally empty.
  }
  return el
}

/**
 * Determines if element has a table ancestor.
 * @param  {!HTMLElement}  el   Element
 * @return {Boolean}            Whether table ancestor of 'el' is found
 */
const isNestedInTable = (el) => {
  return (findClosest(el, 'table') !== null)
}

export default {
  findClosest,
  isNestedInTable
}