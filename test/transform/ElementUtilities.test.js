import assert from 'assert'
import domino from 'domino'
import fixtureIO from '../utilities/FixtureIO'
import pagelib from '../../build/wikimedia-page-library-transform'

const elementUtilities = pagelib.test.ElementUtilities
const Rectangle = pagelib.test.Rectangle
let document

describe('ElementUtilities', () => {
  beforeEach(() => {
    document = fixtureIO.documentFromFixtureFile('ElementUtilities.html')
  })

  describe('matchesSelectorCompat()', () => {
    it('matches()', () => {
      const element = { matches: () => true }
      assert.ok(elementUtilities.matchesSelectorCompat(element, 'html'))
    })

    it('matchesSelector()', () => {
      const element = { matchesSelector: () => true }
      assert.ok(elementUtilities.matchesSelectorCompat(element, 'html'))
    })

    it('webkitMatchesSelector()', () => {
      const element = { webkitMatchesSelector: () => true }
      assert.ok(elementUtilities.matchesSelectorCompat(element, 'html'))
    })

    it('unsupported', () => {
      const element = {}
      assert.ok(!elementUtilities.matchesSelectorCompat(element, 'html'))
    })
  })

  describe('findClosestAncestor()', () => {
    it('doesn\'t consider self', () => {
      const element = document.querySelector('.matching')
      const ancestor = elementUtilities.findClosestAncestor(element, '.matching')
      assert.ok(!ancestor)
    })

    it('find first div ancestor which has a certain class', () => {
      const element = document.getElementById('someImage')
      const ancestor = elementUtilities.findClosestAncestor(element, "div[class='tsingle']")
      assert.ok(ancestor.id === 'imageGreatGrandParentDiv')
    })

    it('find first div ancestor which has a certain class among many classes', () => {
      const element = document.getElementById('someImage')
      const ancestor = elementUtilities.findClosestAncestor(element, "div[class*='someClassOne']")
      assert.ok(ancestor.id === 'imageGrandParentDiv')
    })

    it('try to find an ancestor which does not exist', () => {
      const element = document.getElementById('someImage')
      const ancestor = elementUtilities.findClosestAncestor(element, 'table')
      assert.ok(!ancestor)
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

  describe('intersectsViewportRectangle()', () => {
    let bounds
    const element = { getBoundingClientRect: () => bounds }

    it('inclusive', () => {
      const rectangle = new Rectangle(0, 1, 1, 0)
      bounds = new Rectangle(0, 0, 0, 0)
      assert.ok(elementUtilities.intersectsViewportRectangle(element, rectangle))
    })

    it('within', () => {
      const rectangle = new Rectangle(0, 1, 1, 0)
      bounds = new Rectangle(.5, .5, .5, .5)
      assert.ok(elementUtilities.intersectsViewportRectangle(element, rectangle))
    })

    it('partially disjoint', () => {
      const rectangle = new Rectangle(0, 1, 1, 0)
      bounds = new Rectangle(.5, 1.5, 1.5, .5)
      assert.ok(elementUtilities.intersectsViewportRectangle(element, rectangle))
    })

    it('disjoint', () => {
      const rectangle = new Rectangle(0, 1, 1, 0)
      bounds = new Rectangle(2, 2, 2, 2)
      assert.ok(!elementUtilities.intersectsViewportRectangle(element, rectangle))
    })
  })

  describe('copyAttributesToDataAttributes()', function Test() {
    beforeEach(() => {
      const html = '<img id=source src=/a width=1> <img id=destination src=/b>'
      const document = domino.createDocument(html)
      const source = document.querySelector('#source')
      this.destination = document.querySelector('#destination')
      const attributes = ['width', 'height']
      elementUtilities.copyAttributesToDataAttributes(source, this.destination, attributes)
    })

    it('present', () => assert.ok(this.destination.getAttribute('data-width') === '1'))
    it('missing', () => assert.ok(!this.destination.hasAttribute('data-height')))
  })

  describe('copyDataAttributesToAttributes()', function Test() {
    beforeEach(() => {
      const html = '<img id=source src=/a data-width=1> <img id=destination src=/b>'
      const document = domino.createDocument(html)
      const source = document.querySelector('#source')
      this.destination = document.querySelector('#destination')
      const attributes = ['width', 'height']
      elementUtilities.copyDataAttributesToAttributes(source, this.destination, attributes)
    })

    it('present', () => assert.ok(this.destination.getAttribute('width') === '1'))
    it('missing', () => assert.ok(!this.destination.hasAttribute('height')))
  })
})