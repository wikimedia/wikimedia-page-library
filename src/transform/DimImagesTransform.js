import './DimImagesTransform.css'
const CLASS = 'pagelib_dim_images'

/**
 * @param {!Document} document
 * @param {!boolean} enable
 * @return {void}
 */
const dimImages = (document, enable) => {
  document.querySelector('html').classList[enable ? 'add' : 'remove'](CLASS)
}

/**
 * @deprecated Use dimImages instead, which only requires a Document
 * @param {!Window} window
 * @param {!boolean} enable
 * @return {void}
 */
const dim = (window, enable) => dimImages(window.document, enable)

/**
 * @param {!Document} document
 * @return {boolean}
 */
const isDimImagesOn = document => document.querySelector('html').classList.contains(CLASS)

/**
 * @deprecated Use isDimImagesOn instead, which only requires a Document
 * @param {!Window} window
 * @return {boolean}
 */
const isDim = window => isDimImagesOn(window.document)

export default {
  CLASS,
  dim,
  isDim,
  dimImages,
  isDimImagesOn
}