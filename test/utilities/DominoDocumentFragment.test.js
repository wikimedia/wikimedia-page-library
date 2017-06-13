import assert from 'assert'
import domino from 'domino'
import dominoDocumentFragment from './DominoDocumentFragment'

const documentFragmentFromHTMLString = dominoDocumentFragment.documentFragmentFromHTMLString

describe('DominoDocumentFragment', () => {
  describe('documentFragmentFromHTMLString()', () => {
    it('should return a Domino DocumentFragment when given an HTML string', () => {
      const frag =
        documentFragmentFromHTMLString('<div>text</div><a id="link1"></a>')
      assert.ok(frag instanceof domino.impl.DocumentFragment)
    })
    it('should return a Domino DocumentFragment with expected childNodes', () => {
      const frag =
        documentFragmentFromHTMLString('<div>text</div><a id="link1"></a>')
      assert.ok(frag.childNodes.length === 2)
      assert.ok(frag.childNodes[0].tagName === 'DIV')
      assert.ok(frag.childNodes[1].tagName === 'A')
    })
    it('should not see unexpected method in Domino DocumentFragment', () => {
      const frag =
        documentFragmentFromHTMLString('<div>text</div><a id="link1"></a>')
      assert.ok(frag.createElement === undefined)
    })
  })
})