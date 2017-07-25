import './EditTransform.css'

const CLASS = {
  CONTAINER: 'pagelib_edit_section_link_container',
  LINK: 'pagelib_edit_section_link',
  PROTECTION: { UNPROTECTED: '', PROTECTED: 'page-protected', FORBIDDEN: 'no-editing' }
}

const DATA_ATTRIBUTE = { SECTION_INDEX: 'data-id', ACTION: 'data-action' }
const ACTION_EDIT_SECTION = 'edit_section'

/**
 * @param {!Document} document
 * @param {!number} index The zero-based index of the section.
 * @return {!HTMLAnchorElement}
 */
const newEditSectionLink = (document, index) => {
  const link = document.createElement('a')
  link.href = ''
  link.setAttribute(DATA_ATTRIBUTE.SECTION_INDEX, index)
  link.setAttribute(DATA_ATTRIBUTE.ACTION, ACTION_EDIT_SECTION)
  link.classList.add(CLASS.LINK)
  return link
}

/**
 * @param {!Document} document
 * @param {!number} index The zero-based index of the section.
 * @return {!HTMLSpanElement}
 */
const newEditSectionButton = (document, index) => {
  const container = document.createElement('span')
  container.classList.add(CLASS.CONTAINER)

  const link = newEditSectionLink(document, index)
  container.appendChild(link)

  return container
}

export default {
  CLASS,
  newEditSectionButton
}