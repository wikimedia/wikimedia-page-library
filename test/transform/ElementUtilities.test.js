import assert from 'assert'
import fixtureIO from '../utilities/FixtureIO'
import pagelib from '../../build/wikimedia-page-library-transform'

const ElementUtilities = pagelib.test.ElementUtilities
let document

describe('ElementUtilities', () => {
  beforeEach(() => {
    document = fixtureIO.documentFromFixtureFile('ElementUtilities.html')
  })

  describe('.matchesSelectorCompat()', () => {
    it('matches()', () => {
      const element = { matches: () => true }
      assert.ok(ElementUtilities.matchesSelectorCompat(element, 'html'))
    })

    it('matchesSelector()', () => {
      const element = { matchesSelector: () => true }
      assert.ok(ElementUtilities.matchesSelectorCompat(element, 'html'))
    })

    it('webkitMatchesSelector()', () => {
      const element = { webkitMatchesSelector: () => true }
      assert.ok(ElementUtilities.matchesSelectorCompat(element, 'html'))
    })

    it('unsupported', () => {
      const element = {}
      assert.ok(!ElementUtilities.matchesSelectorCompat(element, 'html'))
    })
  })

  describe('.findClosestAncestor()', () => {
    it('doesn\'t consider self', () => {
      const element = document.querySelector('.matching')
      const ancestor = ElementUtilities.findClosestAncestor(element, '.matching')
      assert.ok(!ancestor)
    })

    it('find first div ancestor which has a certain class', () => {
      const element = document.getElementById('someImage')
      const ancestor = ElementUtilities.findClosestAncestor(element, "div[class='tsingle']")
      assert.ok(ancestor.id === 'imageGreatGrandParentDiv')
    })

    it('find first div ancestor which has a certain class among many classes', () => {
      const element = document.getElementById('someImage')
      const ancestor = ElementUtilities.findClosestAncestor(element, "div[class*='someClassOne']")
      assert.ok(ancestor.id === 'imageGrandParentDiv')
    })

    it('try to find an ancestor which does not exist', () => {
      const element = document.getElementById('someImage')
      const ancestor = ElementUtilities.findClosestAncestor(element, 'table')
      assert.ok(!ancestor)
    })
  })

  describe('.isNestedInTable()', () => {
    it('confirm negative result', () => {
      assert.ok(!ElementUtilities.isNestedInTable(document.getElementById('someImage')))
    })

    it('confirm positive result', () => {
      assert.ok(ElementUtilities.isNestedInTable(document.getElementById('divInTable')))
    })
  })
})