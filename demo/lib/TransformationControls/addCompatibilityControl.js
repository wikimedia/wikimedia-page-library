/* eslint-disable require-jsdoc */

export default [
  'compatibility_checkbox',
  'Compatibility filter *',
  'checkbox',
  null,
  (iframeWindow, iframeDocument) => {
    event.target.disabled = true
    iframeWindow.pagelib.CompatibilityTransform.enableSupport(iframeDocument)
  }
]
