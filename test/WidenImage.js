import applib from '../build/applib'
import assert from 'assert'
import testUtilities from './TestUtilities'

const maybeWidenImage = applib.WidenImage.maybeWidenImage
let document = null

describe('WidenImage', () => {
  beforeEach(() => {
    document = testUtilities.documentFromFixtureFile('WidenImage.html')
  })

  describe('Images which should not widen', () => {
    it('image has usemap', () => {
      const image = document.getElementById('imageWithUsemap')
      const result = maybeWidenImage(image)
      assert.ok(result === false)
      assert.ok(image.classList.contains('wideImageOverride') === false)
    })

    it('image in div with noresize css class', () => {
      const image = document.getElementById('imageInNoResizeDiv')
      const result = maybeWidenImage(image)
      assert.ok(result === false)
      assert.ok(image.classList.contains('wideImageOverride') === false)
    })

    it('image in div with tsingle css class often used for side-by-side images', () => {
      const image = document.getElementById('imageInTSingleDiv')
      const result = maybeWidenImage(image)
      assert.ok(result === false)
      assert.ok(image.classList.contains('wideImageOverride') === false)
    })

    it('image in table', () => {
      const image = document.getElementById('imageInTable')
      const result = maybeWidenImage(image)
      assert.ok(result === false)
      assert.ok(image.classList.contains('wideImageOverride') === false)
    })
  })

  describe('Images which should widen', () => {
    it('widened image width and height attributes are removed', () => {
      const image = document.getElementById('imageWithWidthAndHeight')
      const result = maybeWidenImage(image)
      assert.ok(result === true)
      assert.ok(image.classList.contains('wideImageOverride') === true)
      assert.ok(image.hasAttribute('width') === false)
      assert.ok(image.hasAttribute('height') === false)
    })

    it('widened image ancestors make room for widened image', () => {
      const ancestors = document.querySelectorAll("[id*='widthConstrainedAncestor']")
      // We placed the image in question inside of 3 divs in the fixture html file.
      assert.ok(ancestors.length === 3)

      // Domino doesn't seem to slurp up css class properties if we set them in our fixture html
      // file so we manually set the css style properties we want to test here.
      for (let i = 0; i < ancestors.length; i++) {
        const ancestor = ancestors[i]
        ancestor.style.width = '50%'
        ancestor.style.maxWidth = '50%'
        ancestor.style.float = 'left'
      }

      const image = document.getElementById('imageInWidthConstrainedAncestors')
      const result = maybeWidenImage(image)
      assert.ok(result === true)
      assert.ok(image.classList.contains('wideImageOverride') === true)

      // maybeWidenImage should have changed the style properties we manually set above.
      for (let i = 0; i < ancestors.length; i++) {
        const ancestor = ancestors[i]
        assert.ok(ancestor.style.width === '100%')
        assert.ok(ancestor.style.maxWidth === '100%')
        assert.ok(ancestor.style.float === 'none')
      }
    })
  })
})