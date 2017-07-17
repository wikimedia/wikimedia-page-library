import './ThemeTransform.css'
import ElementUtilities from './ElementUtilities'
import Polyfill from './Polyfill'

// Elements marked with either of these classes indicate certain ancestry constraints that are
// difficult to describe as CSS selectors.
const CONSTRAINT = {
  IMAGE_NO_BACKGROUND: 'pagelib-theme-image-no-background',
  IMAGE_NONTABULAR: 'pagelib-theme-image-nontabular'
}

// Theme to CSS classes.
const THEME = {
  DEFAULT: 'pagelib-theme-default', DARK: 'pagelib-theme-dark', SEPIA: 'pagelib-theme-sepia'
}

/**
 * @param {!Document} document
 * @param {!string} theme
 * @return {void}
 */
const setTheme = (document, theme) => {
  const html = document.querySelector('html')

  // Set the new theme.
  html.classList.add(theme)

  // Clear any previous theme.
  for (const key in THEME) {
    if (Object.prototype.hasOwnProperty.call(THEME, key) && THEME[key] !== theme) {
      html.classList.remove(THEME[key])
    }
  }
}

/**
 * @param {!Element} element
 * @return {void}
 */
const classifyElements = element => {
  Polyfill.querySelectorAll(element, 'img').forEach(image => {
    if (!ElementUtilities.closestInlineStyle(image, 'background')) {
      image.classList.add(CONSTRAINT.IMAGE_NO_BACKGROUND)
    }
    if (!ElementUtilities.isNestedInTable(image)) {
      image.classList.add(CONSTRAINT.IMAGE_NONTABULAR)
    }
  })
}

export default { CONSTRAINT, THEME, setTheme, classifyElements }