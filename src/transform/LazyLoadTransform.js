import './LazyLoadTransform.css'
import ElementUtilities from './ElementUtilities'

// CSS classes used to identify and present transformed images. An image is only a member of one
// class at a time depending on the current transform state. These class names should match the
// classes in LazyLoadTransform.css.
const PENDING_CLASS = 'pagelib-lazy-load-image-pending' // Download pending or started.
const LOADED_CLASS = 'pagelib-lazy-load-image-loaded' // Download completed.

// Attributes saved via data-* attributes for later restoration. These attributes can cause files to
// be downloaded when set so they're temporarily preserved and removed. Additionally, `style.width`
// and `style.height` are saved with their priorities. In the rare case that a conflicting data-*
// attribute already exists, it is overwritten.
const PRESERVE_ATTRIBUTES = ['src', 'srcset']
const PRESERVE_STYLE_WIDTH_VALUE = 'data-width-value'
const PRESERVE_STYLE_HEIGHT_VALUE = 'data-height-value'
const PRESERVE_STYLE_WIDTH_PRIORITY = 'data-width-priority'
const PRESERVE_STYLE_HEIGHT_PRIORITY = 'data-height-priority'

// A transparent single pixel gif via https://stackoverflow.com/a/15960901/970346.
const PLACEHOLDER_URI = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI='

// Small images, especially icons, are quickly downloaded and may appear in many places. Lazily
// loading these images degrades the experience with little gain. Always eagerly load these images.
// Example: the infobox for the 1896 Summer Olympics medal table.
const UNIT_TO_MINIMUM_TRANSFORM_SIZE = {
  px: 50, // https://phabricator.wikimedia.org/diffusion/EMFR/browse/master/includes/MobileFormatter.php;c89f371ea9e789d7e1a827ddfec7c8028a549c12$22
  ex: 10, // ''
  em: 5 // 1ex ≈ .5em; https://developer.mozilla.org/en-US/docs/Web/CSS/length#Units
}

/**
 * @param {!HTMLImageElement} image The image to be consider.
 * @return {!boolean} true if image should be lazily loaded, false if image should be eagerly
 *                    loaded.
*/
const isTransformable = image =>
  ['width', 'height'].every(dimension => {
    let valueUnit = image.style.getPropertyValue(dimension) || ''

    if (valueUnit === '' && image.hasAttribute(dimension)) {
      valueUnit = `${image.getAttribute(dimension)}px`
    }

    const [ , value, unit ] = valueUnit.match(/(\d+)(\D+)/) || []
    return value === undefined || value >= UNIT_TO_MINIMUM_TRANSFORM_SIZE[unit]
  })

/**
 * Replace image data with placeholder content.
 * @param {!Document} document
 * @param {!HTMLImageElement} image The image to be updated.
 * @return {void}
 */
const transformImage = (document, image) => {
  // Minerva's image dimension CSS rule cannot be disinherited:
  //
  //   .content a > img {
  //     max-width: 100% !important;
  //     height: auto !important;
  //   }
  //
  // This forces an image to be bound to screen width and to appear (with scrollbars) proportionally
  // when it is too large. Unfortunately, the placeholder image rarely matches the original's aspect
  // ratio and `height: auto` forces this ratio to be used instead of the original's. Minerva uses
  // spans for placeholders and the CSS rule does not apply. This implementation sets the dimensions
  // as an inline style with height as `!important` to override Minerva. For images that are capped
  // by `max-width`, this usually causes the height of the placeholder and the height of the loaded
  // image to mismatch which causes a reflow. To stimulate this issue, go to the Pablo Picasso
  // article and set the screen width to be less than the image width. When placeholders are
  // replaced with images, the image height reduces dramatically. Minerva has the same limitation
  // with spans. Note: clientWidth is unavailable since this transform occurs in a separate
  // Document.
  //
  // This implementation previously used spans as placeholders and appended an image as a child once
  // loaded. Crossfading worked well but it was difficult to account for all CSS scenarios. Another
  // previous implementation replaced the span instead of appending to it. This reduced the
  // crossfade to just a fade in but still had CSS concerns for the placeholder.
  //
  // https://phabricator.wikimedia.org/diffusion/EMFR/browse/master/resources/skins.minerva.content.styles/images.less;e15c49de788cd451abe648497123480da1c9c9d4$55
  let width = image.style.getPropertyValue('width')
  if (width) {
    image.setAttribute(PRESERVE_STYLE_WIDTH_VALUE, width)
    image.setAttribute(PRESERVE_STYLE_WIDTH_PRIORITY, image.style.getPropertyPriority('width'))
  } else if (image.hasAttribute('width')) {
    width = `${image.getAttribute('width')}px`
  }
  if (width) { image.style.setProperty('width', width) }

  let height = image.style.getPropertyValue('height')
  if (height) {
    image.setAttribute(PRESERVE_STYLE_HEIGHT_VALUE, height)
    image.setAttribute(PRESERVE_STYLE_HEIGHT_PRIORITY, image.style.getPropertyPriority('height'))
  } else if (image.hasAttribute('height')) {
    height = `${image.getAttribute('height')}px`
  }
  if (height) { image.style.setProperty('height', height, 'important') }

  ElementUtilities.moveAttributesToDataAttributes(image, image, PRESERVE_ATTRIBUTES)
  image.setAttribute('src', PLACEHOLDER_URI)

  image.classList.add(PENDING_CLASS)
}

/**
 * Start downloading image resources associated with a given image element and update the
 * placeholder with the original content when available.
 * @param {!Document} document
 * @param {!HTMLImageElement} image The old image element showing placeholder content. This element
 *                                  will be updated when the new image resources finish downloading.
 * @return {!HTMLElement} A new image element for downloading the resources.
 */
const loadImage = (document, image) => {
  const download = document.createElement('img')

  // Add the download listener prior to setting the src attribute to avoid missing the load event.
  download.addEventListener('load', () => {
    ElementUtilities.moveDataAttributesToAttributes(image, image, PRESERVE_ATTRIBUTES)

    if (image.hasAttribute(PRESERVE_STYLE_WIDTH_VALUE)) {
      image.style.setProperty('width', image.getAttribute(PRESERVE_STYLE_WIDTH_VALUE),
        image.getAttribute(PRESERVE_STYLE_WIDTH_PRIORITY))
      image.removeAttribute(PRESERVE_STYLE_WIDTH_VALUE)
      image.removeAttribute(PRESERVE_STYLE_WIDTH_PRIORITY)
    }

    if (image.hasAttribute(PRESERVE_STYLE_HEIGHT_VALUE)) {
      image.style.setProperty('height', image.getAttribute(PRESERVE_STYLE_HEIGHT_VALUE),
        image.getAttribute(PRESERVE_STYLE_HEIGHT_PRIORITY))
      image.removeAttribute(PRESERVE_STYLE_HEIGHT_VALUE)
      image.removeAttribute(PRESERVE_STYLE_HEIGHT_PRIORITY)
    }

    image.classList.remove(PENDING_CLASS)
    image.classList.add(LOADED_CLASS)
  }, { once: true })

  // Set src and other attributes, triggering a download.
  ElementUtilities.copyDataAttributesToAttributes(image, download, PRESERVE_ATTRIBUTES)

  return download
}

/**
 * @param {!Element} element
 * @return {!HTMLImageElement[]} Transformable images descendent from but not including element.
 */
const queryTransformImages = element =>
  Array.prototype.slice.call(element.querySelectorAll('img'))
    .filter(image => isTransformable(image))

/**
 * Replace images with placeholders. The transformation is inverted by calling loadImage().
 * @param {!Document} document
 * @param {!HTMLImageElement[]} images The images to lazily load.
 * @return {void}
 */
const transform = (document, images) => images.forEach(image => transformImage(document, image))

export default {
  loadImage,
  queryTransformImages,
  transform
}