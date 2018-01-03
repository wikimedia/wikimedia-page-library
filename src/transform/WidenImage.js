import './WidenImage.css'
import elementUtilities from './ElementUtilities'

/**
 * Gets array of ancestors of element which need widening.
 * @param  {!HTMLElement} element
 * @return {!Array.<HTMLElement>} Zero length array is returned if no elements should be widened.
 */
const ancestorsToWiden = element => {
  const widenThese = []
  let el = element
  while (el.parentElement) {
    el = el.parentElement
    // No need to walk above 'content_block'.
    if (el.classList.contains('content_block')) {
      break
    }
    widenThese.push(el)
  }
  return widenThese
}

/**
 * Sets style value.
 * @param {!CSSStyleDeclaration} style
 * @param {!string} key
 * @param {*} value
 * @return {void}
 */
const updateStyleValue = (style, key, value) => {
  style[key] = value
}

/**
 * Sets style value only if value for given key already exists.
 * @param {CSSStyleDeclaration} style
 * @param {!string} key
 * @param {*} value
 * @return {void}
 */
const updateExistingStyleValue = (style, key, value) => {
  const valueExists = Boolean(style[key])
  if (valueExists) {
    updateStyleValue(style, key, value)
  }
}

/**
 * Image widening CSS key/value pairs.
 * @type {Object}
 */
const styleWideningKeysAndValues = {
  width: '100%',
  height: 'auto',
  maxWidth: '100%',
  float: 'none'
}

/**
 * Perform widening on an element. Certain style properties are updated, but only if existing values
 * for these properties already exist.
 * @param  {!HTMLElement} element
 * @return {void}
 */
const widenElementByUpdatingExistingStyles = element => {
  Object.keys(styleWideningKeysAndValues)
    .forEach(key => updateExistingStyleValue(element.style, key, styleWideningKeysAndValues[key]))
}

/**
 * Perform widening on an element.
 * @param  {!HTMLElement} element
 * @return {void}
 */
const widenElementByUpdatingStyles = element => {
  Object.keys(styleWideningKeysAndValues)
    .forEach(key => updateStyleValue(element.style, key, styleWideningKeysAndValues[key]))
}

/**
 * To widen an image element a css class called 'pagelib_widen_image_override' is applied to the
 * image element, however, ancestors of the image element can prevent the widening from taking
 * effect. This method makes minimal adjustments to ancestors of the image element being widened so
 * the image widening can take effect.
 * @param  {!HTMLElement} element Element whose ancestors will be widened
 * @return {void}
 */
const widenAncestors = element => {
  ancestorsToWiden(element).forEach(widenElementByUpdatingExistingStyles)

  // Without forcing widening on the parent anchor, lazy image loading placeholders
  // aren't correctly widened on iOS for some reason.
  const parentAnchor = elementUtilities.findClosestAncestor(element, 'a.image')
  if (parentAnchor) {
    widenElementByUpdatingStyles(parentAnchor)
  }
}

/**
 * Some images should not be widened. This method makes that determination.
 * @param  {!HTMLElement} image   The image in question
 * @return {boolean}              Whether 'image' should be widened
 */
const shouldWidenImage = image => {
  // Images within a "<div class='noresize'>...</div>" should not be widened.
  // Example exhibiting links overlaying such an image:
  //   'enwiki > Counties of England > Scope and structure > Local government'
  if (elementUtilities.findClosestAncestor(image, "[class*='noresize']")) {
    return false
  }

  // Side-by-side images should not be widened. Often their captions mention 'left' and 'right', so
  // we don't want to widen these as doing so would stack them vertically.
  // Examples exhibiting side-by-side images:
  //    'enwiki > Cold Comfort (Inside No. 9) > Casting'
  //    'enwiki > Vincent van Gogh > Letters'
  if (elementUtilities.findClosestAncestor(image, "div[class*='tsingle']")) {
    return false
  }

  // Imagemaps, which expect images to be specific sizes, should not be widened.
  // Examples can be found on 'enwiki > Kingdom (biology)':
  //    - first non lead image is an image map
  //    - 'Three domains of life > Phylogenetic Tree of Life' image is an image map
  if (image.hasAttribute('usemap')) {
    return false
  }

  // Images in tables should not be widened - doing so can horribly mess up table layout.
  if (elementUtilities.isNestedInTable(image)) {
    return false
  }

  return true
}

/**
 * Widens the image.
 * @param  {!HTMLElement} image   The image in question
 * @return {void}
 */
const widenImage = image => {
  widenAncestors(image)
  image.classList.add('pagelib_widen_image_override')
}

/**
 * Widens an image if the image is found to be fit for widening.
 * @param  {!HTMLElement} image   The image in question
 * @return {boolean}              Whether or not 'image' was widened
 */
const maybeWidenImage = image => {
  if (shouldWidenImage(image)) {
    widenImage(image)
    return true
  }
  return false
}

export default {
  maybeWidenImage,
  test: {
    ancestorsToWiden,
    shouldWidenImage,
    updateExistingStyleValue,
    widenAncestors,
    widenElementByUpdatingExistingStyles,
    widenElementByUpdatingStyles
  }
}