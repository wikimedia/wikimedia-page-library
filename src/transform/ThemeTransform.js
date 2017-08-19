import './ThemeTransform.css'
import ElementUtilities from './ElementUtilities'
import Polyfill from './Polyfill'

// Elements marked with these classes indicate certain ancestry constraints that are
// difficult to describe as CSS selectors.
const CONSTRAINT = {
  IMAGE_NO_BACKGROUND: 'pagelib-theme-image-no-background',
  DIV_DO_NOT_APPLY_BASELINE: 'pagelib-theme-div-do-not-apply-baseline'
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

/* en > Away colours > 793128975 */
/* en > Manchester United F.C. > 793244653 */
/**
 * Determines whether white background should be added to image.
 * @param  {!HTMLImageElement} image
 * @return {!boolean}
 */
const imageNeedsWhiteBackground = image => {
  const src = image.src
  if (src.endsWith('.svg.png')) {
    return !(
      src.endsWith('Kit_body.svg.png') ||
      src.endsWith('Kit_socks_long.svg.png') ||
      src.endsWith('Kit_shorts.svg.png') ||
      src.endsWith('Kit_right_arm.svg.png') ||
      src.endsWith('Kit_left_arm.svg.png')
    )
  }
  return !ElementUtilities.closestInlineStyle(image, 'background')
}

/**
 * Annotate elements with CSS classes that can be used by CSS rules. The classes themselves are not
 * theme-dependent so classification only need only occur once after the content is loaded, not
 * every time the theme changes.
 * @param {!Element} element
 * @return {void}
 */
const classifyElements = element => {
  Polyfill.querySelectorAll(element, 'img')
    .filter(imageNeedsWhiteBackground)
    .forEach(image => {
      image.classList.add(CONSTRAINT.IMAGE_NO_BACKGROUND)
    })
  /* en > Away colours > 793128975 */
  /* en > Manchester United F.C. > 793244653 */
  /* en > Pantone > 792312384 */
  Polyfill.querySelectorAll(element, 'div.color_swatch div, div[style*="position: absolute"]')
    .forEach(div => {
      div.classList.add(CONSTRAINT.DIV_DO_NOT_APPLY_BASELINE)
    })
}

export default {
  CONSTRAINT,
  THEME,
  setTheme,
  classifyElements
}