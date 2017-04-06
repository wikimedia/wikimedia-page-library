// Implementation of https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
const findClosest = (el, selector) => {
  while ((el = el.parentElement) && !el.matches(selector)) {
    // Intentionally empty.
  }
  return el
}

const isNestedInTable = (el) => {
  return (findClosest(el, 'td') !== null)
}

export default {
  findClosest,
  isNestedInTable
}