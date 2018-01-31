const NodeTypes = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11
}

/**
 * Determines if node is either an element or text node.
 * @param  {!Node}  node
 * @return {!boolean}
 */
const isNodeTypeElementOrText = node =>
  node.nodeType === NodeTypes.ELEMENT_NODE || node.nodeType === NodeTypes.TEXT_NODE

export default {
  isNodeTypeElementOrText,
  NodeTypes
}