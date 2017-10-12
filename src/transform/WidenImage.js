import './WidenImage.css'
import elementUtilities from './ElementUtilities'

/**
 * To widen an image element a css class called 'pagelib_widen_image_override' is applied to the
 * image element, however, ancestors of the image element can prevent the widening from taking
 * effect. This method makes minimal adjustments to ancestors of the image element being widened so
 * the image widening can take effect.
 * @param  {!HTMLElement} el Element whose ancestors will be widened
 * @return {void}
 */
const widenAncestors = el => {
  for (let parentElement = el.parentElement;
    parentElement && !parentElement.classList.contains('content_block');
    parentElement = parentElement.parentElement) {
    if (parentElement.style.width) {
      parentElement.style.width = '100%'
    }
    if (parentElement.style.height) {
      parentElement.style.height = 'auto'
    }
    if (parentElement.style.maxWidth) {
      parentElement.style.maxWidth = '100%'
    }
    if (parentElement.style.float) {
      parentElement.style.float = 'none'
    }
  }
}

/**
 * Some images should not be widened. This method makes that determination.
 * @param  {!HTMLElement} image   The image in question
 * @return {boolean}              Whether 'image' should be widened
 */
const shouldWidenImage = image => {
  // Images within a "<div class='noresize'>...</div>" should not be widened.
  // Example exhibiting links overlaying such an image:
  //   'enwiki > Counties of England > Scope and structure > Local government'
  if (elementUtilities.findClosestAncestor(image, "[class*='noresize']")) {
    return false
  }

  // Side-by-side images should not be widened. Often their captions mention 'left' and 'right', so
  // we don't want to widen these as doing so would stack them vertically.
  // Examples exhibiting side-by-side images:
  //    'enwiki > Cold Comfort (Inside No. 9) > Casting'
  //    'enwiki > Vincent van Gogh > Letters'
  if (elementUtilities.findClosestAncestor(image, "div[class*='tsingle']")) {
    return false
  }

  // Imagemaps, which expect images to be specific sizes, should not be widened.
  // Examples can be found on 'enwiki > Kingdom (biology)':
  //    - first non lead image is an image map
  //    - 'Three domains of life > Phylogenetic Tree of Life' image is an image map
  if (image.hasAttribute('usemap')) {
    return false
  }

  // Images in tables should not be widened - doing so can horribly mess up table layout.
  if (elementUtilities.isNestedInTable(image)) {
    return false
  }

  return true
}

/**
 * Widens the image.
 * @param  {!HTMLElement} image   The image in question
 * @return {void}
 */
const widenImage = image => {
  widenAncestors(image)
  image.classList.add('pagelib_widen_image_override')
}

/**
 * Widens an image if the image is found to be fit for widening.
 * @param  {!HTMLElement} image   The image in question
 * @return {boolean}              Whether or not 'image' was widened
 */
const maybeWidenImage = image => {
  if (shouldWidenImage(image)) {
    widenImage(image)
    return true
  }
  return false
}

export default {
  maybeWidenImage,
  test: {
    shouldWidenImage,
    widenAncestors
  }
}