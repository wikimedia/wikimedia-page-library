import assert from 'assert'
import domino from 'domino'
import fixtureIO from '../utilities/FixtureIO'
import pagelib from '../../build/wikimedia-page-library-transform'

const moveFirstGoodParagraphUp = pagelib.FirstParagraphRelocationTransform.moveFirstGoodParagraphUp
const isParagraphEligible = pagelib.FirstParagraphRelocationTransform.test.isParagraphEligible
const getElementsToMove = pagelib.FirstParagraphRelocationTransform.test.getElementsToMove
const getFirstGoodParagraph =
  pagelib.FirstParagraphRelocationTransform.test.getFirstGoodParagraph

describe('FirstParagraphRelocationTransform', () => {
  describe('isParagraphEligible()', () => {
    const document = domino.createDocument(`<p id="p1"></p><p id="p2">This p has a bunch of
    stuff in it. It's so great. I could read it again and again.</p>`)
    it('accept p with lots of text', () => {
      const goodP = document.getElementById('p2')
      assert.equal(isParagraphEligible(goodP), true)
    })
    it('reject p with no text', () => {
      const emptyP = document.getElementById('p1')
      assert.equal(isParagraphEligible(emptyP), false)
    })
    it('reject p with only coordinates', () => {
      const document = domino.createDocument(`
      <p id="p1">
        <span id="coordinates">
          Coordinates: 39°54′04″N 083°08′13″W / 39.90111°N 83.13694°W / 39.90111; -83.13694
        </span>
      </p>
      `)
      const pWithCoordinates = document.getElementById('p1')
      assert.equal(isParagraphEligible(pWithCoordinates), false)
    })
    it('accept p with coordinates but also lots of text', () => {
      const document = domino.createDocument(`
        <p id="p1">
          <span id="coordinates">
            Coordinates: 39°54′04″N 083°08′13″W / 39.90111°N 83.13694°W / 39.90111; -83.13694
          </span>
          This p has a bunch of stuff in it. It's so great. I could read it again and again.
        </p>
      `)
      const pWithCoordinates = document.getElementById('p1')
      assert.equal(isParagraphEligible(pWithCoordinates), true)
    })
  })
  describe('getElementsToMove()', () => {
    it('grabs accepted p and other elements before next p', () => {
      const document = domino.createDocument(`<p id="p1"></p><p id="p2">This p has a bunch of stuff
      in it. It's so great. I could read it again and again.</p><span id="span1">Other good stuff 1
      </span><span id="span2">Other good stuff 2</span><p id="nextP">Next P stuff</p>`)
      const goodP = document.getElementById('p2')
      const elementIDs = getElementsToMove(goodP).map(el => el.id)
      assert.deepEqual(elementIDs, [ 'p2', 'span1', 'span2' ])
    })
    it('grabs accepted p and nothing else if next element is a p', () => {
      const document = domino.createDocument(`<p id="p1"></p><p id="p2">This p has a bunch of stuff
      in it. It's so great. I could read it again and again.</p><p id="nextP">Next P stuff</p>`)
      const goodP = document.getElementById('p2')
      const elementIDs = getElementsToMove(goodP).map(el => el.id)
      assert.deepEqual(elementIDs, [ 'p2' ])
    })
  })
  describe('getFirstGoodParagraph()', () => {
    it('ignore p in table', () => {
      const document = domino.createDocument(`
        <div id="container">
          <table><tr><td>Table stuff bla bla
            <p id="p1"></p>
            <p id="p2">
              This p has a bunch of stuff in it. It's so great. I could read it again and again. But
              it's in a TABLE!
            </p>
            <p id="nextP">Next P stuff</p>
          </td></tr></table>
          <p id="p3">
            This p has a bunch of stuff in it. It's so great. I could read it again and again.
          </p>
        </div>`)
      const goodP = getFirstGoodParagraph(document, 'container')
      assert.equal(goodP.id, 'p3')
    })
    it('ignore p if not direct child of containerID element', () => {
      const document = domino.createDocument(`
        <div id="container">
          <span>Span stuff bla bla
            <p id="p1"></p>
            <p id="p2">
              This p has a bunch of stuff in it. It's so great. I could read it again and again. But
              it's in a TABLE!
            </p>
            <p id="nextP">Next P stuff</p>
          </span>
          <p id="p3">
            This p has a bunch of stuff in it. It's so great. I could read it again and again.
          </p>
        </div>`)
      const goodP = getFirstGoodParagraph(document, 'container')
      assert.equal(goodP.id, 'p3')
    })
  })
  describe('moveFirstGoodParagraphUp()', () => {

    // eslint-disable-next-line require-jsdoc
    const getChildTagNames = element => Array.from(element.children).map(el => el.tagName)

    it('paragraph is relocated', () => {
      const document = fixtureIO.documentFromFixtureFile('FirstParagraphRelocation-Obama.html')
      const soughtP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
      // Before: [ 'HR', 'DIV', 'TABLE', 'P', 'P', 'P', 'P', 'DIV' ]
      moveFirstGoodParagraphUp(document, 'content_block_0', null)
      assert.deepEqual(
        getChildTagNames(document.getElementById('content_block_0')),
        [ 'P', 'HR', 'DIV', 'TABLE', 'P', 'P', 'P', 'DIV' ]
      )
      const movedP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
      assert.deepEqual(soughtP, movedP)
    })
    it('related UL elements are relocated', () => {
      const document = fixtureIO.documentFromFixtureFile('FirstParagraphRelocation-Planet.html')
      const soughtP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
      // Before: [ 'HR', 'DIV', 'TABLE', 'P', 'UL', 'P', 'P', 'P', 'P', 'P' ]
      moveFirstGoodParagraphUp(document, 'content_block_0', null)
      assert.deepEqual(
        getChildTagNames(document.getElementById('content_block_0')),
        [ 'P', 'UL', 'HR', 'DIV', 'TABLE', 'P', 'P', 'P', 'P', 'P' ]
      )
      const movedP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
      assert.deepEqual(soughtP, movedP)
    })
    it('coordinates ignored, 1st paragraph relocated', () => {
      const document = fixtureIO.documentFromFixtureFile('FirstParagraphRelocation-Sharya.html')
      const soughtP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
      // Before: [ 'HR', 'TABLE', 'P', 'P' ]
      moveFirstGoodParagraphUp(document, 'content_block_0', null)
      assert.deepEqual(
        getChildTagNames(document.getElementById('content_block_0')),
        [ 'P', 'HR', 'TABLE', 'P' ]
      )
      const movedP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
      assert.deepEqual(soughtP, movedP)
    })
    it('coordinates ignored, 2nd paragraph relocated', () => {
      const document = fixtureIO.documentFromFixtureFile('FirstParagraphRelocation-Bolton.html')
      const soughtP = document.querySelector('#content_block_0 > p:nth-of-type(2)')
      // Before: [ 'HR', 'P', 'TABLE', 'P', 'P', 'P' ]
      moveFirstGoodParagraphUp(document, 'content_block_0', null)
      assert.deepEqual(
        getChildTagNames(document.getElementById('content_block_0')),
        [ 'P', 'HR', 'P', 'TABLE', 'P', 'P' ]
      )
      const movedP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
      assert.deepEqual(soughtP, movedP)
    })
  })
})