/* eslint-disable require-jsdoc */

const enableCompatibilitySupport = (iframeWindow, iframeDocument) => {
  event.target.disabled = true
  if (iframeWindow.pagelib.c1) {
    // TODO: compatibility transform is not exposed in the abstraction layer
  } else {
    iframeWindow.pagelib.CompatibilityTransform.enableSupport(iframeDocument)
  }
}

export default [
  'compatibility_checkbox',
  'Compatibility filter *',
  'checkbox',
  null,
  enableCompatibilitySupport,
]
