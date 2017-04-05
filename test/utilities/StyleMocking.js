import assert from 'assert'

// Domino doesn't seem to slurp up css class properties if we set them in our fixture html.
// These methods let us manually set and verify css style properties of element(s) we want to test.

const mockStylesInElement = (element, styles) => {
  for (const style in styles) {
    if ({}.hasOwnProperty.call(styles, style)) {
      element.style[style] = styles[style]
    }
  }
}

const verifyStylesInElement = (element, styles) => {
  for (const style in styles) {
    if ({}.hasOwnProperty.call(styles, style)) {
      const msg = `'${style}' should be '${styles[style]}' but was '${element.style[style]}'`
      assert.ok(element.style[style] === styles[style], msg)
    }
  }
}

const mockStylesInElements = (elements, styles) => {
  for (let i = 0; i < elements.length; i++) {
    mockStylesInElement(elements[i], styles)
  }
}

const verifyStylesInElements = (elements, styles) => {
  for (let i = 0; i < elements.length; i++) {
    verifyStylesInElement(elements[i], styles)
  }
}

export default {
  mockStylesInElement,
  verifyStylesInElement,
  mockStylesInElements,
  verifyStylesInElements
}