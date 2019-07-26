/* eslint-disable require-jsdoc */

const textSizeAdjustmentHandler = (iframeWindow, iframeDocument, value) => {
  if (iframeWindow.pagelib.c1) {
    iframeWindow.pagelib.c1.Page.setTextSizeAdjustmentPercentage(value)
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
