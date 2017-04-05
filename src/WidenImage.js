import './WidenImage.css'
import elementUtilities from './ElementUtilities'

// If enabled, widened images will have thin red dashed border
const enableDebugBorders = false

const widenAncestors = (el) => {
  while ((el = el.parentElement) && !el.classList.contains('content_block')) {
    // Only widen if there was a width setting. Keeps changes minimal.
    if (el.style.width) {
      el.style.width = '100%'
    }
    if (el.style.maxWidth) {
      el.style.maxWidth = '100%'
    }
    if (el.style.float) {
      el.style.float = 'none'
    }
  }
}

const shouldWidenImage = (image) => {
  // Some images are within a <div class='noresize'>...</div> which indicates
  // they should not be widened. Example below has links overlaying such an image.
  // See:
  //   'enwiki > Counties of England > Scope and structure > Local government'
  if (elementUtilities.findClosest(image, "[class*='noresize']")) {
    return false
  }

  // Ensure side-by-side images are left alone. Often their captions mention
  // 'left' and 'right', so we don't want to widen these as doing so would
  // stack them vertically. See the 2 side by side images in
  // 'enwiki > Cold Comfort (Inside No. 9) > Casting' and
  // 'enwiki > Vincent van Gogh > Letters'
  if (elementUtilities.findClosest(image, "div[class*='tsingle']")) {
    return false
  }

  // Imagemap coordinates are specific to a specific image size, so we never want to widen
  // these or the overlaying links will not be over the intended parts of the image.
  // See:
  //   'enwiki > Kingdom (biology) > first non lead image is an image map'
  //   'enwiki > Kingdom (biology) > Three domains of life > Phylogenetic Tree of Life image is
  //   an image map'
  if (image.hasAttribute('usemap')) {
    return false
  }

  // Don't widen if the image is nested in a table or the table layout can be messed up.
  if (elementUtilities.isNestedInTable(image)) {
    return false
  }

  return true
}

const makeRoomForImageWidening = (image) => {
  // Expand containment so css wideImageOverride width percentages can take effect.
  widenAncestors(image)

  // Remove width and height attributes so wideImageOverride width percentages can take effect.
  image.removeAttribute('width')
  image.removeAttribute('height')
}

const widenImage = (image) => {
  makeRoomForImageWidening(image)
  image.classList.add('wideImageOverride')
  if (enableDebugBorders) {
    image.classList.add('wideImageDebug')
  }
}

const maybeWidenImage = (image) => {
  if (shouldWidenImage(image)) {
    widenImage(image)
    return true
  } else {
    return false
  }
}

export default {
  maybeWidenImage,
  test: {
    shouldWidenImage
  }
}