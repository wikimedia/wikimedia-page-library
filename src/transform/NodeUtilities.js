/**
 * Determines if node is either an element or text node.
 * @param  {!Node}  node
 * @return {!boolean}
 */
const isNodeTypeElementOrText = node =>
  node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE

export default {
  isNodeTypeElementOrText
}