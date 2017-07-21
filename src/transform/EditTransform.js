import './EditTransform.css'

const CLASS = {
  CONTAINER: 'edit_section_button_wrapper',
  LINK: 'edit_section_button',
  PROTECTION: { UNPROTECTED: '', PROTECTED: 'page-protected', FORBIDDEN: 'no-editing' }
}

const DATA_ATTRIBUTE = { SECTION_INDEX: 'data-id', ACTION: 'data-action' }
const ACTION_EDIT_SECTION = 'edit_section'

/**
 * @param {!Document} document
 * @param {!number} index The zero-based index of the section.
 * @return {!HTMLSpanElement}
 */
const newEditSectionLink = (document, index) => {
  const container = document.createElement('span')
  container.classList.add(CLASS.CONTAINER)

  const link = document.createElement('a')
  link.setAttribute(DATA_ATTRIBUTE.SECTION_INDEX, index)
  link.setAttribute(DATA_ATTRIBUTE.ACTION, ACTION_EDIT_SECTION)
  link.classList.add(CLASS.LINK)

  container.appendChild(link)

  return container
}

export default {
  CLASS,
  newEditSectionLink
}