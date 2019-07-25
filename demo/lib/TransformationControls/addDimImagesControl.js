/* eslint-disable require-jsdoc */

// PCS abstraction layer doesn't have all the transforms available
// copying areImagesDimmed instead
const CLASS = 'pagelib_dim_images'
const areImagesDimmed = document => document.querySelector('html').classList.contains(CLASS)

const dimImages = (iframeWindow, iframeDocument) => {
  if (iframeWindow.pagelib.c1) {
    iframeWindow.pagelib.c1.Page.setDimImages(
      !areImagesDimmed(iframeWindow.document)
    )
  } else {
    iframeWindow.pagelib.DimImagesTransform.dim(
      iframeWindow,
      !iframeWindow.pagelib.DimImagesTransform.isDim(iframeWindow)
    )
  }
}

export default [
  'dim_images_checkbox',
  'Dim images',
  'checkbox',
  null,
  dimImages,
]
