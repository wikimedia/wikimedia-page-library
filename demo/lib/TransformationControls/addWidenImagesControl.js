/* eslint-disable require-jsdoc */

const shouldWidenImage = image =>
  image.getAttribute('width') && image.getAttribute('height') &&
  parseInt(image.getAttribute('width'), 10) > 64 &&
  parseInt(image.getAttribute('height'), 10) > 64 // &&
  // image.getAttribute('data-file-width') && // MCS is not returning these??
  // image.getAttribute('data-file-height')
  // TODO: file ticket for adding ^ to MCS and/or ensure this gets included on new PCS endpoint!

export default [
  'widen_image_checkbox',
  'Widen images *',
  'checkbox',
  null,
  (iframeWindow, iframeDocument) => {
    event.target.disabled = true
    Array.from(iframeDocument.querySelectorAll('img'))
      .filter(shouldWidenImage)
      .forEach(img => iframeWindow.pagelib.WidenImage.maybeWidenImage(img))
  }
]
