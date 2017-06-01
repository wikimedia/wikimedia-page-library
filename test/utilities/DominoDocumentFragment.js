import assert from 'assert'
import domino from 'domino'

/**
 * Gets a document fragment suitable for use in unit tests
 * Details: https://github.com/fgnass/domino/issues/73#issuecomment-200466430
 * @param {?String} HTMLString An html string
 * @return {!domino.impl.DocumentFragment} A domino implementation of a DocumentFragment
 */
const documentFragmentFromHTMLString = HTMLString => {
  const document = domino.createDocument()
  const template = document.createElement('template')
  template.innerHTML = HTMLString
  const fragment = template.content
  return fragment
}

describe('DominoDocumentFragment', () => {
  describe('documentFragmentFromHTMLString()', () => {
    it('should return a Domino DocumentFragment when given an HTML string', () => {
      const frag =
        documentFragmentFromHTMLString('<div>Oh look! A fragment!</div><a id="link1"></a>')
      assert.ok(frag instanceof domino.impl.DocumentFragment)
    })
    it('should return a Domino DocumentFragment with expected childNodes', () => {
      const frag =
        documentFragmentFromHTMLString('<div>Oh look! A fragment!</div><a id="link1"></a>')
      assert.ok(frag.childNodes.length === 2)
      const firstChild = frag.childNodes[0]
      const secondChild = frag.childNodes[1]
      assert.ok(firstChild.tagName === 'DIV')
      assert.ok(secondChild.tagName === 'A')
    })
    it('should not see unexpected method in Domino DocumentFragment', () => {
      const frag =
        documentFragmentFromHTMLString('<div>Oh look! A fragment!</div><a id="link1"></a>')
      assert.ok(frag.createElement === undefined)
    })
  })
})

export default {
  documentFragmentFromHTMLString
}