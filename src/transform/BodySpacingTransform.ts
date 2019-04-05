interface Spacing {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

/**
 * Sets the margins on an element via inline styles.
 * @param {!HTMLElement} element the element that needs the margins adjusted.
 *   For the apps this is usually the body element.
 * @param {Spacing} values { top, right, bottom, left }
 *   Use value strings with units, e.g. '16px'. Undefined values are ignored.
 * @param callback callback function
 * @return {void}
 */
const setMargins = (element: HTMLElement, values: Spacing, callback?: () => void): void => {
  if (values.top !== undefined) {
    element.style.marginTop = values.top
  }
  if (values.right !== undefined) {
    element.style.marginRight = values.right
  }
  if (values.bottom !== undefined) {
    element.style.marginBottom = values.bottom
  }
  if (values.left !== undefined) {
    element.style.marginLeft = values.left
  }
  if (callback) {
    callback()
  }
}

/**
 * Sets padding on an element via inline styles.
 * @param {!HTMLElement} element the element that needs the padding adjusted.
 *   For the apps this is usually the body element.
 * @param {Spacing} values { top, right, bottom, left }
 *   Use value strings with units, e.g. '16px'. Undefined values are ignored.
 * @param callback callback function
 * @return {void}
 */
const setPadding = (element: HTMLElement, values: Spacing, callback?: () => void): void => {
  if (values.top !== undefined) {
    element.style.paddingTop = values.top
  }
  if (values.right !== undefined) {
    element.style.paddingRight = values.right
  }
  if (values.bottom !== undefined) {
    element.style.paddingBottom = values.bottom
  }
  if (values.left !== undefined) {
    element.style.paddingLeft = values.left
  }
  if (callback) {
    callback()
  }
}

export default {
  setMargins,
  setPadding
}