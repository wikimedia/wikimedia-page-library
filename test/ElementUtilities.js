import assert from 'assert'
import fixtureIO from './utilities/FixtureIO'
import pagelib from '../build/wikimedia-page-library-transform'

const elementUtilities = pagelib.test.ElementUtilities
let document = null

describe('ElementUtilities', () => {
  beforeEach(() => {
    document = fixtureIO.documentFromFixtureFile('ElementUtilities.html')
  })

  describe('findClosest()', () => {
    it('find first div ancestor which has a certain class', () => {
      const element = document.getElementById('someImage')
      const ancestor = elementUtilities.findClosest(element, "div[class='tsingle']")
      assert.ok(ancestor.id === 'imageGreatGrandParentDiv')
    })

    it('find first div ancestor which has a certain class among many classes', () => {
      const element = document.getElementById('someImage')
      const ancestor = elementUtilities.findClosest(element, "div[class*='someClassOne']")
      assert.ok(ancestor.id === 'imageGrandParentDiv')
    })

    it('try to find an ancestor which does not exist', () => {
      const element = document.getElementById('someImage')
      const ancestor = elementUtilities.findClosest(element, 'table')
      assert.ok(ancestor === null)
    })
  })

  describe('isNestedInTable()', () => {
    it('confirm negative result', () => {
      assert.ok(!elementUtilities.isNestedInTable(document.getElementById('someImage')))
    })

    it('confirm positive result', () => {
      assert.ok(elementUtilities.isNestedInTable(document.getElementById('divInTable')))
    })
  })
})