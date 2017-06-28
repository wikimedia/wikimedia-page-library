import './LazyLoadTransform.css'
import ElementUtilities from './ElementUtilities'

// CSS classes used to identify and present transformed images. Placeholders are always members of
// the PLACEHOLDER_CLASS and exactly one of PENDING, LOADING, or LOADED, depending on the current
// transform state. These class names should match what's used in LazyLoadTransform.css.
const PLACEHOLDER_CLASS = 'pagelib-lazy-load-placeholder' // Always present.
const PLACEHOLDER_PENDING_CLASS = 'pagelib-lazy-load-placeholder-pending' // Download not started.
const PLACEHOLDER_LOADING_CLASS = 'pagelib-lazy-load-placeholder-loading' // Download started.
const PLACEHOLDER_LOADED_CLASS = 'pagelib-lazy-load-placeholder-loaded' // Download completed.

// Selector used to identify transformable images. Images must be parented.
const TRANSFORM_IMAGE_SELECTOR = `:not(.${PLACEHOLDER_CLASS}) img`

// Selector used to identify images previously transformed but not yet loading or loaded.
const PENDING_PLACEHOLDER_SELECTOR = `.${PLACEHOLDER_PENDING_CLASS}`

// Attributes copied from images to placeholders via data-* attributes for later restoration.
const COPY_ATTRIBUTES = ['class', 'style', 'src', 'srcset', 'width', 'height', 'alt']

/**
 * Create and populate a new placeholder from an image.
 * @param {!Document} document
 * @param {!HTMLImageElement} image The image to be replaced.
 * @return {!HTMLSpanElement}
 */
const newPlaceholder = (document, image) => {
  const placeholder = document.createElement('span')

  ElementUtilities.copyAttributesToDataAttributes(image, placeholder, COPY_ATTRIBUTES)

  placeholder.classList.add(PLACEHOLDER_CLASS)
  placeholder.classList.add(PLACEHOLDER_PENDING_CLASS)

  const width = image.hasAttribute('width') ? `width: ${image.width}px;` : ''
  const height = image.hasAttribute('height') ? `height: ${image.height}px;` : ''
  placeholder.setAttribute('style', width + height)

  return placeholder
}

/**
 * Create and populate a new image from a placeholder.
 * @param {!Document} document
 * @param {!HTMLSpanElement} placeholder
 * @param {!Function} loadEventListener
 * @return {!HTMLImageElement}
 */
const newImageSubstitute = (document, placeholder, loadEventListener) => {
  const image = document.createElement('img')

  // Add the download listener prior to setting the src attribute to avoid missing the load event.
  image.addEventListener('load', loadEventListener, { once: true })

  // Set src and other attributes, triggering a download.
  ElementUtilities.copyDataAttributesToAttributes(placeholder, image, COPY_ATTRIBUTES)

  return image
}

/**
 * Replace image with placeholder.
 * @param {!Document} document
 * @param {!HTMLImageElement} image The image to be replaced. Must be parented.
 * @return {void}
 */
const transformImage = (document, image) => {
  // Replace the image and its attributes with a span to prevent the image from downloading. A
  // replacement span is used instead of the image itself for consistency with MobileFrontend /
  // Minerva and because image src is not an animatable property which prevents cross-fading with
  // the background.
  image.parentNode.replaceChild(newPlaceholder(document, image), image)

  // The image still exists in the DOM. Ensure no unused resources are loaded.
  for (const attribute of ['class', 'style', 'src', 'srcset']) { image.removeAttribute(attribute) }
}

/**
 * Load and append a substitute image to placeholder once loaded.
 * @param {!Document} document
 * @param {!HTMLSpanElement} placeholder
 * @return {!HTMLImageElement} The substitute image (for testing use only).
 */
const loadImage = (document, placeholder) => {
  placeholder.classList.remove(PLACEHOLDER_PENDING_CLASS)
  placeholder.classList.add(PLACEHOLDER_LOADING_CLASS)

  const image = newImageSubstitute(document, placeholder, () => {
    placeholder.appendChild(image)

    placeholder.classList.remove(PLACEHOLDER_LOADING_CLASS)
    placeholder.classList.add(PLACEHOLDER_LOADED_CLASS)
  })

  return image
}

/**
 * @param {!Element} element
 * @return {!HTMLImageElement[]} Transformable images descendent from but not including element.
 */
const queryTransformImages = element => element.querySelectorAll(TRANSFORM_IMAGE_SELECTOR)

/**
 * @param {!Element} element
 * @return {!HTMLSpanElement[]} Loadable placeholders descendent from but not including element.
 */
const queryPlaceholders = element => element.querySelectorAll(PENDING_PLACEHOLDER_SELECTOR)

/**
 * Replace images with placeholders. Only image class, style, src, srcset, width, height, and alt
 * attributes are preserved. The transformation is inverted by calling loadImages().
 * @param {!Document} document
 * @param {!HTMLImageElement[]} images The images to replace.
 * @return {void}
 */
const transform = (document, images) => images.forEach(image => transformImage(document, image))

/**
 * Visually* replace placeholders with images. Images only appear once loaded.
 *
 * *Substitute images are actually appended to the placeholders.
 * @param {!Document} document
 * @param {!HTMLSpanElement[]} placeholders The placeholders to replace.
 * @return {void}
 */
const loadImages = (document, placeholders) =>
  placeholders.forEach(placeholder => loadImage(document, placeholder))

export default {
  test: { transformImage, loadImage },
  queryTransformImages,
  queryPlaceholders,
  transform,
  loadImages
}