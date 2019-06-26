import ElementUtilities from './ElementUtilities'
import NodeUtilities from './NodeUtilities'
import Polyfill from './Polyfill'

const REFERENCE_SELECTOR = '.reference, .mw-ref'
const CITE_HASH_PREFIX = '#cite_note'

/**
 * Is Citation.
 * @param {!string} href
 * @return {!boolean}
 */
const isCitation = href => href.indexOf(CITE_HASH_PREFIX) > -1

/**
 * Determines if node is a text node containing only whitespace.
 * @param {!Node} node
 * @return {!boolean}
 */
const isWhitespaceTextNode = node =>
  Boolean(node) && node.nodeType === Node.TEXT_NODE && Boolean(node.textContent.match(/^\s+$/))

/**
 * Checks if element has a child anchor with a citation link.
 * @param {!Element} element
 * @return {!boolean}
 */
const hasCitationLink = element => {
  const anchor = element.querySelector('a')
  return anchor && isCitation(anchor.hash)
}

/**
 * Get the reference text container.
 * @param {!Document} document
 * @param {!Element} source
 * @return {?HTMLElement}
 */
const getRefTextContainer = (document, source) => {
  const refTextContainerID = source.querySelector('A').getAttribute('href').slice(1)
  const refTextContainer = document.getElementById(refTextContainerID)
    || document.getElementById(decodeURIComponent(refTextContainerID))

  return refTextContainer
}

/**
 * Extract reference text free of backlinks.
 * @param {!Document} document
 * @param {!Element} source
 * @return {!string}
 */
const collectRefText = (document, source) => {
  const refTextContainer = getRefTextContainer(document, source)
  if (!refTextContainer) {
    return ''
  }

  // Clone what we're interested in into a frag so we can easily
  // remove things without consequence to the 'live' document.
  const frag = document.createDocumentFragment()
  const fragDiv = document.createElement('div')
  frag.appendChild(fragDiv)
  // eslint-disable-next-line require-jsdoc
  const cloneNodeIntoFragmentDiv = node => fragDiv.appendChild(node.cloneNode(true))
  Array.prototype.slice.call(refTextContainer.childNodes)
    .filter(NodeUtilities.isNodeTypeElementOrText)
    .forEach(cloneNodeIntoFragmentDiv)

  const removalSelector = 'link, style, sup[id^=cite_ref], .mw-cite-backlink'
  Polyfill.querySelectorAll(fragDiv, removalSelector)
    .forEach(node => node.remove())

  return fragDiv.innerHTML.trim()
}

/**
 * Get closest element to node which has class `reference`. If node itself has class `reference`
 * returns the node.
 * @param {!Node} sourceNode
 * @return {?HTMLElement}
 */
const closestReferenceClassElement = sourceNode => {
  if (Polyfill.matchesSelector(sourceNode, REFERENCE_SELECTOR)) {
    return sourceNode
  }
  return ElementUtilities.findClosestAncestor(sourceNode, REFERENCE_SELECTOR)
}

/**
 * Reference item model.
 */
class ReferenceItem {
  /**
   * ReferenceItem construtor.
   * @param {!string} id
   * @param {!DOMRect} rect
   * @param {?string} text
   * @param {?string} html
   */
  constructor(id, rect, text, html) {
    this.id = id
    this.rect = rect
    this.text = text
    this.html = html
  }
}

/**
 * Reference item model.
 */
class ReferenceItemV2 {
  /**
   * ReferenceItemV2 construtor.
   * @param {!string} href
   * @param {?string} text
   */
  constructor(href, text) {
    this.href = href
    this.text = text
  }
}

/**
 * Converts node to ReferenceItem.
 * @param {!Document} document
 * @param {!Node} node
 * @return {!ReferenceItem}
 */
const referenceItemForNode = (document, node) => new ReferenceItem(
  closestReferenceClassElement(node).id,
  node.getBoundingClientRect(),
  node.textContent,
  collectRefText(document, node)
)

/**
 * Converts node to ReferenceItemV2.
 * @param {!Document} document
 * @param {!Node} node
 * @return {!ReferenceItem}
 */
const referenceItemForNodeV2 = (document, node) => new ReferenceItemV2(
  node.querySelector('A').getAttribute('href'),
  node.textContent
)

/**
 * Container for nearby references including the index of the selected reference.
 */
class NearbyReferences {
/**
 * @param {!number} selectedIndex
 * @param {!Array.<ReferenceItem>} referencesGroup
 * @return {!NearbyReferences}
 */
  constructor(selectedIndex, referencesGroup) {
    this.selectedIndex = selectedIndex
    this.referencesGroup = referencesGroup
  }
}

/**
 * Closure around a node for getting previous or next sibling.
 *
 * @typedef SiblingGetter
 * @param {!Node} node
 * @return {?Node}
 */

/**
  * Closure around `collectedNodes` for collecting reference nodes.
  *
  * @typedef Collector
  * @param {!Node} node
  * @return {void}
  */

/**
 * Get adjacent non-whitespace node.
 * @param {!Node} node
 * @param {!SiblingGetter} siblingGetter
 * @return {?Node}
 */
const adjacentNonWhitespaceNode = (node, siblingGetter) => {
  let currentNode = node
  do {
    currentNode = siblingGetter(currentNode)
  } while (isWhitespaceTextNode(currentNode))
  return currentNode
}

/**
 * Collect adjacent reference nodes. The starting node is not collected.
 * @param {!Node} node
 * @param {!SiblingGetter} siblingGetter
 * @param {!Collector} nodeCollector
 * @return {void}
 */
const collectAdjacentReferenceNodes = (node, siblingGetter, nodeCollector) => {
  let currentNode = node
  while (true) {
    currentNode = adjacentNonWhitespaceNode(currentNode, siblingGetter)
    if (!currentNode || currentNode.nodeType !== Node.ELEMENT_NODE
        || !hasCitationLink(currentNode)) {
      break
    }
    nodeCollector(currentNode)
  }
}

/* eslint-disable valid-jsdoc */
/** @type {SiblingGetter} */
const prevSiblingGetter = node => node.previousSibling

/** @type {SiblingGetter} */
const nextSiblingGetter = node => node.nextSibling
/* eslint-enable valid-jsdoc */

/**
 * Collect nearby reference nodes.
 * @param {!Node} sourceNode
 * @return {!Array.<Node>}
 */
const collectNearbyReferenceNodes = sourceNode => {
  const collectedNodes = [sourceNode]

  /* eslint-disable require-jsdoc */
  // These are `Collector`s.
  const collectedNodesUnshifter = node => collectedNodes.unshift(node)
  const collectedNodesPusher = node => collectedNodes.push(node)
  /* eslint-enable require-jsdoc */

  collectAdjacentReferenceNodes(sourceNode, prevSiblingGetter, collectedNodesUnshifter)
  collectAdjacentReferenceNodes(sourceNode, nextSiblingGetter, collectedNodesPusher)

  return collectedNodes
}

/**
 * Collect nearby references.
 * @param {!Document} document
 * @param {!Node} sourceNode
 * @return {!NearbyReferences}
 */
const collectNearbyReferences = (document, sourceNode) => {
  const sourceNodeParent = sourceNode.parentElement
  const referenceNodes = collectNearbyReferenceNodes(sourceNodeParent)
  const selectedIndex = referenceNodes.indexOf(sourceNodeParent)
  const referencesGroup = referenceNodes.map(node => referenceItemForNode(document, node))
  return new NearbyReferences(selectedIndex, referencesGroup)
}

/**
 * Collect nearby references.
 * @param {!Document} document
 * @param {!Node} sourceNode
 * @return {!NearbyReferences}
 */
const collectNearbyReferencesAsText = (document, sourceNode) => {
  const sourceNodeParent = sourceNode.parentElement
  const referenceNodes = collectNearbyReferenceNodes(sourceNodeParent)
  const selectedIndex = referenceNodes.indexOf(sourceNodeParent)
  const referencesGroup = referenceNodes.map(node => referenceItemForNodeV2(document, node))
  return new NearbyReferences(selectedIndex, referencesGroup)
}

export default {
  collectNearbyReferences,
  collectNearbyReferencesAsText,
  isCitation,
  test: {
    adjacentNonWhitespaceNode,
    closestReferenceClassElement,
    collectAdjacentReferenceNodes,
    collectNearbyReferenceNodes,
    collectRefText,
    getRefTextContainer,
    hasCitationLink,
    isWhitespaceTextNode,
    nextSiblingGetter,
    prevSiblingGetter
  }
}