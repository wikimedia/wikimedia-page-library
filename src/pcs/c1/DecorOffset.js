let value = 0

/**
 * Sets the decor offset height in pixel
 * @param {!number} newValue pixel value
 * @return {void}
 */
const setValue = newValue => {
  value = newValue
}

/**
 * Gets the current decor offset height in pixel
 * @return {number}
 */
const getValue = () => value

/**
 * Scrolls the WebView to the top of the container parent node.
 * Can be used as FooterDivClickCallback
 * @param {!Element} container
 * @return {void}
 */
const scrollWithDecorOffset = container => {
  window.scrollTo(0, container.parentNode.offsetTop - value)
}

export default {
  setValue,
  scrollWithDecorOffset,
  testing: {
    getValue
  }
}