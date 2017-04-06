import applib from '../build/applib'
import assert from 'assert'
import fixtureIO from './utilities/FixtureIO'
import styleMocking from './utilities/StyleMocking'

const maybeWidenImage = applib.WidenImage.maybeWidenImage
const shouldWidenImage = applib.WidenImage.test.shouldWidenImage
const widenAncestors = applib.WidenImage.test.widenAncestors

let document = null

describe('WidenImage', () => {
  beforeEach(() => {
    document = fixtureIO.documentFromFixtureFile('WidenImage.html')
  })

  describe('shouldWidenImage()', () => {
    it('should indicate image with usemap attribute not be widened', () => {
      assert.ok(!shouldWidenImage(document.getElementById('imageWithUsemap')))
    })

    it('should indicate image in div w/noresize class not be widened', () => {
      assert.ok(!shouldWidenImage(document.getElementById('imageInNoResizeDiv')))
    })

    it('should indicate image in div w/tsingle class not be widened', () => {
      // tsingle is often used for side-by-side images
      assert.ok(!shouldWidenImage(document.getElementById('imageInTSingleDiv')))
    })

    it('should indicate image in table not be widened', () => {
      assert.ok(!shouldWidenImage(document.getElementById('imageInTable')))
    })

    it('should indicate two images from the fixture be widened', () => {
      const images = Array.from(document.getElementsByTagName('img')).filter((image) => {
        return (shouldWidenImage(image) && image.classList.contains('imageWhichShouldWiden'))
      })
      assert.ok(images.length === 2)
    })

    it('should indicate four images from the fixture not be widened', () => {
      const images = Array.from(document.getElementsByTagName('img')).filter((image) => {
        return (!shouldWidenImage(image) && image.classList.contains('imageWhichShouldNotWiden'))
      })
      assert.ok(images.length === 4)
    })
  })

  describe('maybeWidenImage()', () => {
    it('maybeWidenImage always has same return value as shouldWidenImage', () => {
      const images = Array.from(document.getElementsByTagName('img')).filter((image) => {
        return (shouldWidenImage(image) === maybeWidenImage(image))
      })
      assert.ok(images.length === 6)
    })

    it('widened image has wideImageOverride class added to its classList', () => {
      const image = document.querySelector('.imageWhichShouldWiden')
      maybeWidenImage(image)
      assert.ok(image.classList.contains('wideImageOverride'))
    })

    it('widened image has its width attribute removed', () => {
      const image = document.getElementById('imageWithWidthAndHeight')
      maybeWidenImage(image)
      assert.ok(!image.hasAttribute('width'))
    })

    it('widened image has its height attribute removed', () => {
      const image = document.getElementById('imageWithWidthAndHeight')
      maybeWidenImage(image)
      assert.ok(!image.hasAttribute('height'))
    })

    it('widened image ancestors make room for widened image', () => {
      const ancestors = Array.from(document.querySelectorAll('.widthConstrainedAncestor'))

      styleMocking.mockStylesInElements(ancestors, {
        width: '50%',
        maxWidth: '50%',
        float: 'right'
      })

      const image = document.getElementById('imageInWidthConstrainedAncestors')
      widenAncestors(image)

      // maybeWidenImage should have changed the style properties we manually set above.
      styleMocking.verifyStylesInElements(ancestors, {
        width: '100%',
        maxWidth: '100%',
        float: 'none'
      })
    })

    it('widening ancestors stops at content_block', () => {
      const body = document.getElementsByTagName('body')[0]
      styleMocking.mockStylesInElement(body, { width: '50%' })
      const image = document.getElementById('imageInWidthConstrainedAncestors')
      widenAncestors(image)
      // widenAncestors should have bailed at the content_block div, thus never reaching
      // the body element - so we can just check that the body element width has not changed.
      styleMocking.verifyStylesInElement(body, { width: '50%' })
    })

    it('two images from the fixture are actually widened', () => {
      const images = Array.from(document.getElementsByTagName('img')).filter((image) => {
        return (maybeWidenImage(image) && image.classList.contains('wideImageOverride'))
      })
      assert.ok(images.length === 2)
    })
  })
})