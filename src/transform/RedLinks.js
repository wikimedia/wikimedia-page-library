/**
 * Configures span to be suitable replacement for redLink anchor.
 * @param {!HTMLSpanElement} span The span element to configure as anchor replacement.
 * @param {!HTMLAnchorElement} anchor The anchor element being replaced.
 * @return {void}
 */
const configureSpanAsAnchorReplacement = (span, anchor) => {
  span.innerHTML = anchor.innerHTML
  span.setAttribute('class', anchor.getAttribute('class'))
}

/**
 * Finds redLinks in a document or document fragment.
 * @param {!(Document|DocumentFragment)} content Document or fragment in which to seek redLinks.
 * @return {!NodeList} Nodelist of zero or more redLink anchors.
 */
const redLinkAnchorsInContent = content => content.querySelectorAll('a.new')

/**
 * Makes span to be used as cloning template for redLink anchor replacements.
 * @param  {!Document} document Document to use to create span element. Reminder: this can't be a
 * document fragment because fragments don't implement 'createElement'.
 * @return {!HTMLSpanElement} Span element suitable for use as template for redLink anchor
 * replacements.
 */
const newRedLinkTemplate = document => document.createElement('span')

/**
 * Replaces anchor with span.
 * @param  {!HTMLAnchorElement} anchor Anchor element.
 * @param  {!HTMLSpanElement} span Span element.
 * @return {void}
 */
const replaceAnchorWithSpan = (anchor, span) => anchor.parentNode.replaceChild(span, anchor)

/**
 * Hides redLink anchors in either a document or a document fragment so they are unclickable and
 * unfocusable.
 * @param {!Document} document Document in which to hide redLinks.
 * @param {?DocumentFragment} fragment If specified, redLinks are hidden in the fragment and the
 * document is used only for span cloning.
 * @return {void}
 */
const hideRedLinks = (document, fragment) => {
  const spanTemplate = newRedLinkTemplate(document)
  const content = fragment !== undefined ? fragment : document
  redLinkAnchorsInContent(content)
    .forEach(redLink => {
      const span = spanTemplate.cloneNode(false)
      configureSpanAsAnchorReplacement(span, redLink)
      replaceAnchorWithSpan(redLink, span)
    })
}

export default {
  hideRedLinks,
  test: {
    configureSpanAsAnchorReplacement,
    redLinkAnchorsInContent,
    newRedLinkTemplate,
    replaceAnchorWithSpan
  }
}