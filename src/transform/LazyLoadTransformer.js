// Classes used to identify image and video placeholders yet to be loaded. These classes should
// match those in LazyLoadTransformer.css.
const PLACEHOLDER_IMAGE_CLASS = 'pagelib-lazy-load-image-placeholder'
const PLACEHOLDER_VIDEO_CLASS = 'pagelib-lazy-load-video-placeholder'

// Selector used to identify transformable elements.
const TRANSFORM_SELECTOR
  = `img:not(.${PLACEHOLDER_IMAGE_CLASS}), video:not(.${PLACEHOLDER_VIDEO_CLASS})`

// Selector used to identify elements previously transformed.
const INVERT_SELECTOR = `img.${PLACEHOLDER_IMAGE_CLASS}, video.${PLACEHOLDER_VIDEO_CLASS}`

/**
 * A mapping of attribute names to placeholder values for an HTML tag. For transformations, an
 * element's attribute is moved to a data-* attribute of the same name as the attribute but with a
 * `data-` prefix. For inversions, the element's transformed attribute is deleted and the data-*
 * attribute is restored to a standard attribute.
 * @typedef {{attribute: ?string, placeholder: ?string}} PlaceholderTagAttributes
 */

// A transparent single pixel gif; see http://stackoverflow.com/a/9967193/970346.
const PLACEHOLDER_IMAGE_URI
  = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

/** @type {PlaceholderTagAttributes} */
const PLACEHOLDER_IMAGE_ATTRIBUTES = {
  class: PLACEHOLDER_IMAGE_CLASS,
  src: PLACEHOLDER_IMAGE_URI,
  srcset: PLACEHOLDER_IMAGE_URI
}

/** @type {PlaceholderTagAttributes} */
const PLACEHOLDER_VIDEO_ATTRIBUTES = {
  class: PLACEHOLDER_VIDEO_CLASS, poster: PLACEHOLDER_IMAGE_URI
}

/**
 * Transforms an element's attributes. The affected attributes are moved to data-* attributes and
 * the attributes are updated to the placeholder values specified. Placeholder values are applied
 * unconditionally but the original attributes are only preserved if present so that the
 * transformation may be undone losslessly.
 * @param {!Element} element The element whose attributes will be transformed.
 * @param {!PlaceholderTagAttributes} attributes The attributes to be affected and their replacement
 *                                               values.
 * @return {void}
 */
const transformAttributes = (element, attributes) => {
  for (const [attribute, placeholder] of Object.entries(attributes)) {
    const dataAttribute = `data-${attribute}`
    if (element.hasAttribute(attribute)) {
      element.setAttribute(dataAttribute, element.getAttribute(attribute))
    }
    element.setAttribute(attribute, placeholder)
  }
}

/**
 * Restores an element's attributes. The affected data-* attributes replace the transformed
 * attributes. The inversion is one-to-one if no data-* attribute conflict existed.
 * @param {!Element} element The element whose attributes will be inverted.
 * @param {!PlaceholderTagAttributes} attributes The attributes to be affected.
 * @return {void}
 */
const invertAttributes = (element, attributes) => {
  for (const [attribute] of Object.entries(attributes)) {
    const dataAttribute = `data-${attribute}`
    if (element.hasAttribute(dataAttribute)) {
      element.setAttribute(attribute, element.getAttribute(dataAttribute))
      element.removeAttribute(dataAttribute)
    } else {
      element.removeAttribute(attribute)
    }
  }
}

/**
 * Unconditionally transforms a supported element to a placeholder.
 * @param {!Element} element The element to be transformed, usually an HTMLImageElement.
 * @return {void}
 */
const transformElement = element => {
  if (element instanceof HTMLImageElement) {
    transformAttributes(element, PLACEHOLDER_IMAGE_ATTRIBUTES)
  } else if (element instanceof HTMLVideoElement) {
    transformAttributes(element, PLACEHOLDER_VIDEO_ATTRIBUTES)
  }
}

/**
 * Unconditionally restores a supported element from a placeholder to its original.
 * @param {!Element} element The element to be inverted, usually an HTMLImageElement.
 * @return {void}
 */
const invertElement = element => {
  if (element instanceof HTMLImageElement) {
    invertAttributes(element, PLACEHOLDER_IMAGE_ATTRIBUTES)
  } else if (element instanceof HTMLVideoElement) {
    invertAttributes(element, PLACEHOLDER_VIDEO_ATTRIBUTES)
  }
}

/**
 * Replaces all images and videos with placeholders:
 * - Image class, src, and srcset, and video class and poster attributes are moved to data-*
 *   attributes if set.
 * - Image and video class' are set to pagelib-lazy-load-*-placeholder.
 * - Image src and srcset and video poster are each set to an empty data source if present.
 * The transformation is reversed by calling invert(). This method is safe to call multiple times.
 * @param {!Element} element
 * @return {void}
 */
const transform = element => element.querySelectorAll(TRANSFORM_SELECTOR).forEach(transformElement)

/**
 * Undoes transform() and replaces all placeholder with their original contents. This method is safe
 * to call multiple times.
 * @param {!Element} element
 * @return {void}
 */
const invert = element => element.querySelectorAll(INVERT_SELECTOR).forEach(invertElement)

export default {
  test: { transformAttributes, invertAttributes, transformElement, invertElement },
  transform,
  invert
}