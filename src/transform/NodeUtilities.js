// Node is undefined in Node.js
const ElementNode = 1
const TextNode = 3

/**
 * Determines if node is either an element or text node.
 * @param  {!Node}  node
 * @return {!boolean}
 */
const isNodeTypeElementOrText = node =>
  node.nodeType === ElementNode || node.nodeType === TextNode

export default {
  isNodeTypeElementOrText,
  ElementNode,
  TextNode
}