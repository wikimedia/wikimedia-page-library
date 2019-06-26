/* eslint-disable require-jsdoc */

export default [
  'hide_redlinks_checkbox',
  'Hide redlinks *',
  'checkbox',
  null,
  (iframeWindow, iframeDocument) => {
    event.target.disabled = true
    iframeWindow.pagelib.RedLinks.hideRedLinks(iframeDocument)
  }
]
