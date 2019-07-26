/* eslint-disable require-jsdoc */

const hideRedLinks = (iframeWindow, iframeDocument) => {
  event.target.disabled = true
  if (!iframeWindow.pagelib.c1) {
    iframeWindow.pagelib.RedLinks.hideRedLinks(iframeDocument)
  }
}

export default [
  'hide_redlinks_checkbox',
  'Hide redlinks *',
  'checkbox',
  null,
  hideRedLinks,
]
