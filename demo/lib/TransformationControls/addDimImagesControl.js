/* eslint-disable require-jsdoc */

export default [
  'dim_images_checkbox',
  'Dim images',
  'checkbox',
  null,
  (iframeWindow, iframeDocument) => {
    iframeWindow.pagelib.DimImagesTransform.dim(
      iframeWindow,
      !iframeWindow.pagelib.DimImagesTransform.isDim(iframeWindow)
    )
  }
]
