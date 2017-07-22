import './DimImagesTransform.css'
const CLASS = 'pagelib-dim-images'

/**
 * @param {!Window} window
 * @param {!boolean} shouldDim
 * @return {void}
 */
const dimImages = (window, shouldDim) => {
  window.document.querySelector('html')
    .classList[shouldDim ? 'add' : 'remove'](CLASS)
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