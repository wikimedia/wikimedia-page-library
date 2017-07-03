/**
 * Configures span to be suitable replacement for red link anchor.
 * @param {!HTMLSpanElement} span The span element to configure as anchor replacement.
 * @param {!HTMLAnchorElement} anchor The anchor element being replaced.
 * @return {void}
 */
const configureTemplate = (span, anchor) => {
  span.innerHTML = anchor.innerHTML
  span.setAttribute('class', anchor.getAttribute('class'))
}

/**
 * Finds red links in a document or document fragment.
 * @param {!(Document|DocumentFragment)} content Document or fragment in which to seek red links.
 * @return {!NodeList} Nodelist of zero or more red link anchors.
 */
const redLinkAnchorsInContent = content => content.querySelectorAll('a.new')

/**
 * Makes span to be used as cloning template for red link anchor replacements.
 * @param  {!Document} document Document to use to create span element. Reminder: this can't be a
 * document fragment because fragments don't implement 'createElement'.
 * @return {!HTMLSpanElement} Span element suitable for use as template for red link anchor
 * replacements.
 */
const newTemplate = document => document.createElement('span')

/**
 * Replaces anchor with span.
 * @param  {!HTMLAnchorElement} anchor Anchor element.
 * @param  {!HTMLSpanElement} span Span element.
 * @return {void}
 */
const replaceAnchorWithSpan = (anchor, span) => anchor.parentNode.replaceChild(span, anchor)

/**
 * Hides red link anchors in either a document or a document fragment so they are unclickable and
 * unfocusable.
 * @param {!Document} document Document in which to hide red links.
 * @param {?DocumentFragment} fragment If specified, red links are hidden in the fragment and the
 * document is used only for span cloning.
 * @return {void}
 */
const hide = (document, fragment) => {
  const spanTemplate = newTemplate(document)
  const content = fragment !== undefined ? fragment : document
  redLinkAnchorsInContent(content)
    .forEach(redLink => {
      const span = spanTemplate.cloneNode(false)
      configureTemplate(span, redLink)
      replaceAnchorWithSpan(redLink, span)
    })
}

export default {
  hide,
  test: {
    configureTemplate,
    redLinkAnchorsInContent,
    newTemplate,
    replaceAnchorWithSpan
  }
}