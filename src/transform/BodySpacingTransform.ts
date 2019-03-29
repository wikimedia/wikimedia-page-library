interface Spacing {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

/**
 * Sets the margins on the body element via inline styles.
 * @param {!Document} document
 * @param {Spacing} values { top, right, bottom, left }
 *   Use value strings with units, e.g. '16px'. Undefined values are ignored.
 * @param callback callback function
 * @return {void}
 */
const setMargins = (document: Document, values: Spacing, callback?: () => void): void => {
  const body: HTMLElement = document.body
  if (values.top !== undefined) {
    body.style.marginTop = values.top
  }
  if (values.right !== undefined) {
    body.style.marginRight = values.right
  }
  if (values.bottom !== undefined) {
    body.style.marginBottom = values.bottom
  }
  if (values.left !== undefined) {
    body.style.marginLeft = values.left
  }
  if (callback) {
    callback()
  }
}

/**
 * Sets padding on the body element via inline styles.
 * @param {!Document} document
 * @param {Spacing} values { top, right, bottom, left }
 *   Use value strings with units, e.g. '16px'. Undefined values are ignored.
 * @param callback callback function
 * @return {void}
 */
const setPadding = (document: Document, values: Spacing, callback?: () => void): void => {
  const body: HTMLElement = document.body
  if (values.top !== undefined) {
    body.style.paddingTop = values.top
  }
  if (values.right !== undefined) {
    body.style.paddingRight = values.right
  }
  if (values.bottom !== undefined) {
    body.style.paddingBottom = values.bottom
  }
  if (values.left !== undefined) {
    body.style.paddingLeft = values.left
  }
  if (callback) {
    callback()
  }
}

export default {
  setMargins,
  setPadding
}