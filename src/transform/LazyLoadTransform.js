import './LazyLoadTransform.css'
import ElementUtilities from './ElementUtilities'
import Polyfill from './Polyfill'

// CSS classes used to identify and present converted images. An image is only a member of one class
// at a time depending on the current transform state. These class names should match the classes in
// LazyLoadTransform.css.
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
// Example: flags in the medal count for the "1896 Summer Olympics medal table."
// https://en.m.wikipedia.org/wiki/1896_Summer_Olympics_medal_table?oldid=773498394#Medal_count
const UNIT_TO_MINIMUM_LAZY_LOAD_SIZE = {
  px: 50, // https://phabricator.wikimedia.org/diffusion/EMFR/browse/master/includes/MobileFormatter.php;c89f371ea9e789d7e1a827ddfec7c8028a549c12$22
  ex: 10, // ''
  em: 5 // 1ex ≈ .5em; https://developer.mozilla.org/en-US/docs/Web/CSS/length#Units
}

/**
 * @param {!string} value
 * @return {!string[]} A value-unit tuple.
 */
const splitStylePropertyValue = value => {
  const matchValueUnit = value.match(/(\d+)(\D+)/) || []
  return [matchValueUnit[1] || '', matchValueUnit[2] || '']
}

/**
 * @param {!HTMLImageElement} image The image to be consider.
 * @return {!boolean} true if image download can be deferred, false if image should be eagerly
 *                    loaded.
*/
const isLazyLoadable = image =>
  ['width', 'height'].every(dimension => {
    // todo: remove `|| ''` when https://github.com/fgnass/domino/issues/98 is fixed.
    let valueUnitString = image.style.getPropertyValue(dimension) || ''

    if (!valueUnitString && image.hasAttribute(dimension)) {
      valueUnitString = `${image.getAttribute(dimension)}px`
    }

    const valueUnit = splitStylePropertyValue(valueUnitString)
    return !valueUnit[0] || valueUnit[0] >= UNIT_TO_MINIMUM_LAZY_LOAD_SIZE[valueUnit[1]]
  })

/**
 * Replace image data with placeholder content.
 * @param {!Document} document
 * @param {!HTMLImageElement} image The image to be updated.
 * @return {void}
 */
const convertImageToPlaceholder = (document, image) => {
  // There are a number of possible implementations including:
  //
  // - [Previous] Replace the original image with a span and append a new downloaded image to the
  //   span.
  //   This option has the best cross-fading and extensibility but makes the CSS rules for the
  //   appended image impractical.
  //
  // - [MobileFrontend] Replace the original image with a span and replace the span with a new
  //   downloaded image.
  //   This option has a good fade-in but has some CSS concerns for the placeholder, particularly
  //   `max-width`.
  //
  // - [Current] Replace the original image's source with a transparent image and update the source
  //   from a new downloaded image.
  //   This option has a good fade-in but minimal CSS concerns for the placeholder and image.
  //
  // Minerva's tricky image dimension CSS rule cannot be disinherited:
  //
  //   .content a > img {
  //     max-width: 100% !important;
  //     height: auto !important;
  //   }
  //
  // This forces an image to be bound to screen width and to appear (with scrollbars) proportionally
  // when it is too large. For the current implementation, unfortunately, the transparent
  // placeholder image rarely matches the original's aspect ratio and `height: auto !important`
  // forces this ratio to be used instead of the original's. MobileFrontend uses spans for
  // placeholders and the CSS rule does not apply. This implementation sets the dimensions as an
  // inline style with height as `!important` to override MobileFrontend. For images that are capped
  // by `max-width`, this usually causes the height of the placeholder and the height of the loaded
  // image to mismatch which causes a reflow. To stimulate this issue, go to the "Pablo Picasso"
  // article and set the screen width to be less than the image width. When placeholders are
  // replaced with images, the image height reduces dramatically. MobileFrontend has the same
  // limitation with spans. Note: clientWidth is unavailable since this conversion occurs in a
  // separate Document.
  //
  // Reflows also occur in this and MobileFrontend when the image width or height do not match the
  // actual file dimensions. e.g., see the image captioned "Obama and his wife Michelle at the Civil
  // Rights Summit..." on the "Barack Obama" article.
  //
  // https://phabricator.wikimedia.org/diffusion/EMFR/browse/master/resources/skins.minerva.content.styles/images.less;e15c49de788cd451abe648497123480da1c9c9d4$55
  // https://en.m.wikipedia.org/wiki/Barack_Obama?oldid=789232530
  // https://en.m.wikipedia.org/wiki/Pablo_Picasso?oldid=788122694
  let width = image.style.getPropertyValue('width')
  if (width) {
    image.setAttribute(PRESERVE_STYLE_WIDTH_VALUE, width)
    image.setAttribute(PRESERVE_STYLE_WIDTH_PRIORITY, image.style.getPropertyPriority('width'))
  } else if (image.hasAttribute('width')) {
    width = `${image.getAttribute('width')}px`
  }
  // !important priority for WidenImage (`width: 100% !important` and placeholder is 1px wide).
  if (width) { image.style.setProperty('width', width, 'important') }

  let height = image.style.getPropertyValue('height')
  if (height) {
    image.setAttribute(PRESERVE_STYLE_HEIGHT_VALUE, height)
    image.setAttribute(PRESERVE_STYLE_HEIGHT_PRIORITY, image.style.getPropertyPriority('height'))
  } else if (image.hasAttribute('height')) {
    height = `${image.getAttribute('height')}px`
  }
  // !important priority for Minerva.
  if (height) { image.style.setProperty('height', height, 'important') }

  ElementUtilities.moveAttributesToDataAttributes(image, image, PRESERVE_ATTRIBUTES)
  image.setAttribute('src', PLACEHOLDER_URI)

  image.classList.add(PENDING_CLASS)
}

/**
 * @param {!HTMLImageElement} image
 * @return {void}
 */
const loadImageCallback = image => {
  if (image.hasAttribute(PRESERVE_STYLE_WIDTH_VALUE)) {
    image.style.setProperty('width', image.getAttribute(PRESERVE_STYLE_WIDTH_VALUE),
      image.getAttribute(PRESERVE_STYLE_WIDTH_PRIORITY))
  } else {
    image.style.removeProperty('width')
  }

  if (image.hasAttribute(PRESERVE_STYLE_HEIGHT_VALUE)) {
    image.style.setProperty('height', image.getAttribute(PRESERVE_STYLE_HEIGHT_VALUE),
      image.getAttribute(PRESERVE_STYLE_HEIGHT_PRIORITY))
  } else {
    image.style.removeProperty('height')
  }
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
    image.classList.add(LOADED_CLASS)
    image.classList.remove(PENDING_CLASS)

    // Add the restoration listener prior to setting the src attribute to avoid missing the load
    // event.
    image.addEventListener('load', () => loadImageCallback(image), { once: true })

    // Set src and other attributes, triggering a download from cache which still takes time on
    // older devices. Waiting until the image is loaded prevents an unnecessary potential reflow due
    // to the call to style.removeProperty('height')`.
    ElementUtilities.moveDataAttributesToAttributes(image, image, PRESERVE_ATTRIBUTES)
  }, { once: true })

  // Set src and other attributes, triggering a download.
  ElementUtilities.copyDataAttributesToAttributes(image, download, PRESERVE_ATTRIBUTES)

  return download
}

/**
 * @param {!Element} element
 * @return {!HTMLImageElement[]} Convertible images descendent from but not including element.
 */
const queryLazyLoadableImages = element =>
  Polyfill.querySelectorAll(element, 'img').filter(image => isLazyLoadable(image))

/**
 * Convert images with placeholders. The transformation is inverted by calling loadImage().
 * @param {!Document} document
 * @param {!HTMLImageElement[]} images The images to lazily load.
 * @return {void}
 */
const convertImagesToPlaceholders = (document, images) =>
  images.forEach(image => convertImageToPlaceholder(document, image))

export default {
  loadImage,
  queryLazyLoadableImages,
  convertImagesToPlaceholders
}