import assert from 'assert'

// Domino doesn't seem to slurp up css class properties if we set them in our fixture html.
// These methods let us manually set and verify css style properties of element(s) we want to test.

const mockStylesInElement = (element, styles) => {
  for (const [key, value] of Object.entries(styles)) {
    element.style[key] = value
  }
}

const verifyStylesInElement = (element, styles) => {
  for (const [key, value] of Object.entries(styles)) {
    const msg = `'${key}' was expected to be '${value}' but was '${element.style[key]}'`
    assert.ok(element.style[key] === value, msg)
  }
}

const mockStylesInElements = (elements, styles) => {
  for (const element of elements) {
    mockStylesInElement(element, styles)
  }
}

const verifyStylesInElements = (elements, styles) => {
  for (const element of elements) {
    verifyStylesInElement(element, styles)
  }
}

export default {
  mockStylesInElement,
  verifyStylesInElement,
  mockStylesInElements,
  verifyStylesInElements
}