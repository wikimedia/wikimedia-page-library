import assert from 'assert'
import fixtureIO from '../utilities/FixtureIO'
import pagelib from '../../build/wikimedia-page-library-transform'
import styleMocking from '../utilities/StyleMocking'

const maybeWiden = pagelib.WidenImageTransform.maybeWiden
const shouldWiden = pagelib.WidenImageTransform.test.shouldWiden
const widenAncestors = pagelib.WidenImageTransform.test.widenAncestors

let document

describe('WidenImageTransform', () => {
  beforeEach(() => {
    document = fixtureIO.documentFromFixtureFile('WidenImageTransform.html')
  })

  describe('.shouldWiden()', () => {
    it('should indicate image with usemap attribute not be widened', () => {
      assert.ok(!shouldWiden(document.getElementById('imageWithUsemap')))
    })

    it('should indicate image in div w/noresize class not be widened', () => {
      assert.ok(!shouldWiden(document.getElementById('imageInNoResizeDiv')))
    })

    it('should indicate image in div w/tsingle class not be widened', () => {
      // tsingle is often used for side-by-side images
      assert.ok(!shouldWiden(document.getElementById('imageInTSingleDiv')))
    })

    it('should indicate image in table not be widened', () => {
      assert.ok(!shouldWiden(document.getElementById('imageInTable')))
    })

    it('should indicate two images from the fixture be widened', () => {
      const images = Array.from(document.getElementsByTagName('img')).filter(image =>
        shouldWiden(image) && image.classList.contains('imageWhichShouldWiden'))
      assert.ok(images.length === 2)
    })

    it('should indicate four images from the fixture not be widened', () => {
      const images = Array.from(document.getElementsByTagName('img')).filter(image =>
        !shouldWiden(image) && image.classList.contains('imageWhichShouldNotWiden'))
      assert.ok(images.length === 4)
    })
  })

  describe('.maybeWiden()', () => {
    it('maybeWiden always has same return value as shouldWiden', () => {
      const images = Array.from(document.getElementsByTagName('img')).filter(image =>
        shouldWiden(image) === maybeWiden(image))
      assert.ok(images.length === 6)
    })

    it('widened image has wideImageOverride class added to its classList', () => {
      const image = document.querySelector('.imageWhichShouldWiden')
      maybeWiden(image)
      assert.ok(image.classList.contains('wideImageOverride'))
    })

    it('widened image has its width attribute removed', () => {
      const image = document.getElementById('imageWithWidthAndHeight')
      maybeWiden(image)
      assert.ok(!image.hasAttribute('width'))
    })

    it('widened image has its height attribute removed', () => {
      const image = document.getElementById('imageWithWidthAndHeight')
      maybeWiden(image)
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

      // maybeWiden should have changed the style properties we manually set above.
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
      const images = Array.from(document.getElementsByTagName('img')).filter(image =>
        maybeWiden(image) && image.classList.contains('wideImageOverride'))
      assert.ok(images.length === 2)
    })
  })
})