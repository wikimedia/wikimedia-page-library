import './DimImagesTransform.css'
const CLASS = 'pagelib_dim_images'

/**
 * @param {!Window} window
 * @param {!boolean} enable
 * @return {void}
 */
const dimImages = (window, enable) => {
  window.document.querySelector('html')
    .classList[enable ? 'add' : 'remove'](CLASS)
}

/**
 * @param {!Window} window
 * @return {boolean}
 */
const isDimmingEnabled = window => window.document.querySelector('html')
  .classList.contains(CLASS)

export default {
  CLASS,
  isDimmingEnabled,
  dimImages
}