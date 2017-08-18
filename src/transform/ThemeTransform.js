import './ThemeTransform.css'
import ElementUtilities from './ElementUtilities'
import Polyfill from './Polyfill'

// Elements marked with these classes indicate certain ancestry constraints that are
// difficult to describe as CSS selectors.
const CONSTRAINT = {
  IMAGE_NO_BACKGROUND: 'pagelib-theme-image-no-background',
  IMAGE_NONTABULAR: 'pagelib-theme-image-nontabular',
  DIV_INSIDE_COLOR_SWATCH_DIV: 'pagelib-theme-div-color-swatch'
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
 * Annotate elements with CSS classes that can be used by CSS rules. The classes themselves are not
 * theme-dependent so classification only need only occur once after the content is loaded, not
 * every time the theme changes.
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
  Polyfill.querySelectorAll(element, 'div.color_swatch div').forEach(div => {
    div.classList.add(CONSTRAINT.DIV_INSIDE_COLOR_SWATCH_DIV)
  })
}

export default {
  CONSTRAINT,
  THEME,
  setTheme,
  classifyElements
}