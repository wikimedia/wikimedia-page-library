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

// Attributes copied from images to placeholders via data-* attributes for later restoration. If
// additional data savings are wanted, don't restore srcset.
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

  const width = image.hasAttribute('width') ? `width: ${image.getAttribute('width')}px;` : ''
  const height = image.hasAttribute('height') ? `height: ${image.getAttribute('height')}px;` : ''
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
 * @return {!HTMLSpanElement} The placeholder that replaced the image.
 */
const transformImage = (document, image) => {
  // Replace the image and its attributes with a span to prevent the image from downloading. A
  // replacement span is used instead of the image itself for consistency with MobileFrontend /
  // Minerva and because image src is not an animatable property which prevents cross-fading with
  // the background.
  const placeholder = newPlaceholder(document, image)
  image.parentNode.replaceChild(placeholder, image)

  // The image still exists in the DOM. Ensure no unused resources are loaded.
  for (const attribute of ['src', 'srcset']) { image.removeAttribute(attribute) }

  return placeholder
}

/**
 * Visually* replace placeholder with a substitute image. The image only appears once loaded.
 *
 * *The substitute image is actually appended to the placeholder.
 * @param {!Document} document
 * @param {!HTMLSpanElement} placeholder The placeholder to replace.
 * @return {!HTMLImageElement} The substitute image.
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
const queryTransformImages = element =>
  Array.prototype.slice.call(element.querySelectorAll(TRANSFORM_IMAGE_SELECTOR))

/**
 * Replace images with placeholders. Only image class, style, src, srcset, width, height, and alt
 * attributes are preserved. The transformation is inverted by calling loadImages().
 * @param {!Document} document
 * @param {!HTMLImageElement[]} images The images to replace.
 * @return {!HTMLSpanElement[]} Placeholders that replaced images.
 */
const transform = (document, images) => images.map(image => transformImage(document, image))

export default {
  test: { transformImage },
  loadImage,
  queryTransformImages,
  transform
}