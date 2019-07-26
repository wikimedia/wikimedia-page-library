import './WidenImage.css'
import elementUtilities from './ElementUtilities'

const MIN_IMAGE_SIZE = 48
const MATHOID_IMG_CLASS = 'mwe-math-fallback-image-inline'

const thumbBucketWidthCandidates = [
  640,
  320
]

const MediaSelectors = [
  '*[typeof^=mw:Image]',
  '*[typeof^=mw:Video]',
  '*[typeof^=mw:Audio]',
  `img.${MATHOID_IMG_CLASS}`
]

// Exclusions for various categories of content. See MMVB.isAllowedThumb in mediawiki-extensions-
// MultimediaViewer.
const MediaBlacklist = [
  '.metadata',
  '.noviewer',
]

const VideoSelectors = MediaSelectors.filter(selector => selector.includes('Video'))

const PronunciationParentSelector = 'span.IPA'
const PronunciationSelector = 'a[rel=mw:MediaLink]'
const SpokenWikipediaId = '#section_SpokenWikipedia'
/**
 * Gets array of ancestors of element which need widening.
 * @param  {!HTMLElement} element
 * @return {!Array.<HTMLElement>} Zero length array is returned if no elements should be widened.
 */
const ancestorsToWiden = element => {
  const widenThese = []
  let el = element
  while (el.parentElement) {
    el = el.parentElement
    // No need to walk above 'content_block'.
    if (el.classList.contains('content_block')) {
      break
    }
    widenThese.push(el)
  }
  return widenThese
}

/**
 * Sets style value.
 * @param {!CSSStyleDeclaration} style
 * @param {!string} key
 * @param {*} value
 * @return {void}
 */
const updateStyleValue = (style, key, value) => {
  style[key] = value
}

/**
 * Sets style value only if value for given key already exists.
 * @param {CSSStyleDeclaration} style
 * @param {!string} key
 * @param {*} value
 * @return {void}
 */
const updateExistingStyleValue = (style, key, value) => {
  const valueExists = Boolean(style[key])
  if (valueExists) {
    updateStyleValue(style, key, value)
  }
}

/**
 * Image widening CSS key/value pairs.
 * @type {Object}
 */
const styleWideningKeysAndValues = {
  width: '100%',
  height: 'auto',
  maxWidth: '100%',
  float: 'none'
}

/**
 * Perform widening on an element. Certain style properties are updated, but only if existing values
 * for these properties already exist.
 * @param  {!HTMLElement} element
 * @return {void}
 */
const widenElementByUpdatingExistingStyles = element => {
  Object.keys(styleWideningKeysAndValues)
    .forEach(key => updateExistingStyleValue(element.style, key, styleWideningKeysAndValues[key]))
}

/**
 * Perform widening on an element.
 * @param  {!HTMLElement} element
 * @return {void}
 */
const widenElementByUpdatingStyles = element => {
  Object.keys(styleWideningKeysAndValues)
    .forEach(key => updateStyleValue(element.style, key, styleWideningKeysAndValues[key]))
}

/**
 * To widen an image element a css class called 'pagelib_widen_image_override' is applied to the
 * image element, however, ancestors of the image element can prevent the widening from taking
 * effect. This method makes minimal adjustments to ancestors of the image element being widened so
 * the image widening can take effect.
 * @param  {!HTMLElement} element Element whose ancestors will be widened
 * @return {void}
 */
const widenAncestors = element => {
  ancestorsToWiden(element).forEach(widenElementByUpdatingExistingStyles)

  // Without forcing widening on the parent anchor, lazy image loading placeholders
  // aren't correctly widened on iOS for some reason.
  const parentAnchor = elementUtilities.findClosestAncestor(element, 'a.image')
  if (parentAnchor) {
    widenElementByUpdatingStyles(parentAnchor)
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

  // Widening absolutely positioned images can cause overlapping with adjacent text.
  // Example can be found on `ja > 今治城 > 71804195`, which has a Mapplot template which outputs
  // an image nested in an absolutely positioned div.
  if (elementUtilities.closestInlineStyle(image, 'position', 'absolute')) {
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
  console.log(image.tagName)
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

/**
 * Determines whether or not an image is a gallery image
 * @param  {!HTMLElement} image   The image in question
 * @return {boolean}              Whether or not 'image' is a gallery image
 */
const isGalleryImage = image => image.width >= 64

/**
 * Returns whether the element or an ancestor is part of a blacklisted class
 * @param {!Element} elem an HTML Element
 * @return {!boolean} true if the element or an ancestor is part of a blacklisted class
 */
const isDisallowed = elem => !!elem.closest(MediaBlacklist.join())

const isFromGallery = elem => !!elem.closest('.gallerybox')

/**
 * Returns whether the on-page size of an <img> element is small enough to filter from the response
 * @param {!Element} img an <img> element
 */
const isTooSmall = img => {
  const width = img.getAttribute('width')
  const height = img.getAttribute('height')
  return width < MIN_IMAGE_SIZE || height < MIN_IMAGE_SIZE
}

/**
 * Widens all gallery images in a document that need widening
 * @param  {!HTMLDocument} document  The document in question
 * @return {void}
 */
const widenGalleryImagesInDocument = document => {
  Array.from(document.querySelectorAll('figure img')).forEach(image => {
    if (isGalleryImage(image)) {
      maybeWidenImage(image)
    }
  })
}

const THUMB_URL_PATH_REGEX = /\/thumb\//
const THUMB_WIDTH_REGEX = /(\d+)px-[^/]+$/

const scaleThumbUrl = function(initialUrl, desiredWidth, originalWidth) {
  if (!initialUrl.match(THUMB_URL_PATH_REGEX)) {
    // not a thumb URL
    return
  }
  const match = THUMB_WIDTH_REGEX.exec(initialUrl)
  if (match) {
    const maxWidth = originalWidth || match[1]
    if (maxWidth > desiredWidth) {
      const newSubstring = match[0].replace(match[1], desiredWidth)
      return initialUrl.replace(THUMB_WIDTH_REGEX, newSubstring)
    }
  }
}

const adjustSrcSet = (srcSet, origWidth, candidateBucketWidth) => {
  const srcSetEntries = srcSet.split(',').map(str => str.trim())
  const updatedEntries = []
  srcSetEntries.forEach(entry => {
    const entryParts = entry.split(' ')
    const src = entryParts[0]
    const res = entryParts[1]
    const multiplier = res.substring(0, res.toLowerCase().indexOf('x'))
    const desiredWidth = candidateBucketWidth * multiplier
    if (desiredWidth < origWidth) {
      const scaledThumbUrl = scaleThumbUrl(src, desiredWidth, origWidth)
      if (scaledThumbUrl) {
        updatedEntries.push(`${scaledThumbUrl} ${res}`)
      }
    }
  })
  if (updatedEntries.length) {
    return updatedEntries.join(', ')
  }
}

const adjustThumbWidths = document => {
  const imgs = document.querySelectorAll('img');
  [].forEach.call(imgs, img => {
    if (isTooSmall(img) || isDisallowed(img) || isFromGallery(img)) {
      return
    }
    const src = img.getAttribute('src')
    const srcSet = img.getAttribute('srcset')
    const width = img.getAttribute('width')
    const height = img.getAttribute('height')
    const origWidth = img.getAttribute('data-file-width')
    for (let i = 0; i < thumbBucketWidthCandidates.length; i++) {
      const candidateBucketWidth = thumbBucketWidthCandidates[i]
      if (candidateBucketWidth >= origWidth) {
        continue
      }
      const scaledThumbUrl = scaleThumbUrl(src, candidateBucketWidth, origWidth)
      if (scaledThumbUrl) {
        img.setAttribute('src', scaledThumbUrl)
        img.setAttribute('height', Math.round(height * candidateBucketWidth / width))
        img.setAttribute('width', candidateBucketWidth)
        if (srcSet) {
          const adjustedSrcSet = adjustSrcSet(srcSet, origWidth, candidateBucketWidth)
          if (adjustedSrcSet) {
            img.setAttribute('srcSet', adjustedSrcSet)
          } else {
            img.removeAttribute('srcSet')
          }
        }
        break
      }
    }
  })
}

export default {
  adjustThumbWidths,
  maybeWidenImage,
  widenGalleryImagesInDocument,
  test: {
    ancestorsToWiden,
    shouldWidenImage,
    updateExistingStyleValue,
    widenAncestors,
    widenElementByUpdatingExistingStyles,
    widenElementByUpdatingStyles
  }
}