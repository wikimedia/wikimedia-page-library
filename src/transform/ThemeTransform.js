import './ThemeTransform.css'
import ElementUtilities from './ElementUtilities'
import Polyfill from './Polyfill'

// Elements marked with these classes indicate certain ancestry constraints that are
// difficult to describe as CSS selectors.
const CONSTRAINT = {
  IMAGE_PRESUMES_WHITE_BACKGROUND: 'pagelib_theme_image_presumes_white_background',
  DIV_DO_NOT_APPLY_BASELINE: 'pagelib_theme_div_do_not_apply_baseline'
}

// Theme to CSS classes.
const THEME = {
  DEFAULT: 'pagelib_theme_default', DARK: 'pagelib_theme_dark', SEPIA: 'pagelib_theme_sepia'
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
 * Football template image filename regex.
 * https://en.wikipedia.org/wiki/Template:Football_kit/pattern_list
 * @type {RegExp}
 */
const footballTemplateImageFilenameRegex =
  new RegExp('Kit_(body|socks|shorts|right_arm|left_arm)(.*).png$')

/* en > Away colours > 793128975 */
/* en > Manchester United F.C. > 793244653 */
/**
 * Determines whether white background should be added to image.
 * @param  {!HTMLImageElement} image
 * @return {!boolean}
 */
const imagePresumesWhiteBackground = image => {
  if (footballTemplateImageFilenameRegex.test(image.src)) {
    return false
  }
  if (image.classList.contains('mwe-math-fallback-image-inline')) {
    return false
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
    .filter(imagePresumesWhiteBackground)
    .forEach(image => {
      image.classList.add(CONSTRAINT.IMAGE_PRESUMES_WHITE_BACKGROUND)
    })
  /* en > Away colours > 793128975 */
  /* en > Manchester United F.C. > 793244653 */
  /* en > Pantone > 792312384 */
  /* en > Wikipedia:Graphs_and_charts > 801754530 */
  /* en > PepsiCo > 807406166 */
  const selector = [
    'div.color_swatch div',
    'div[style*="position: absolute"]',
    'div.barbox table div[style*="background:"]',
    'div.chart div[style*="background-color"]',
    'div.chart ul li span[style*="background-color"]',
    'span.legend-color'
  ].join()
  Polyfill.querySelectorAll(element, selector).forEach(element =>
    element.classList.add(CONSTRAINT.DIV_DO_NOT_APPLY_BASELINE))
}

export default {
  CONSTRAINT,
  THEME,
  setTheme,
  classifyElements
}