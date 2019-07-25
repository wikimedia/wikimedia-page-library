/* eslint-disable require-jsdoc */

const textSizeAdjustmentHandler = (iframeWindow, iframeDocument, value) => {
  if (iframeWindow.pagelib.c1) {
    iframeWindow.pagelib.c1.PageMods.setTextSizeAdjustmentPercentage(iframeDocument, value)
  } else {
    iframeWindow.pagelib.AdjustTextSize.setPercentage(iframeDocument.body, value)
  }
}
/**
 * this only works on certain mobile browsers
 * https://caniuse.com/#feat=text-size-adjust
 */
export default [
  'adjust_text_size_form',
  'Text Size Adjustment (Percentage) * **',
  'form',
  'percentage',
  textSizeAdjustmentHandler
]
