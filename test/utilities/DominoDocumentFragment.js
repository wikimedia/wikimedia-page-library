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

export default {
  documentFragmentFromHTMLString
}