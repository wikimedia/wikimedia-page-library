/* eslint-disable require-jsdoc */

export default [
  'edit_pencil_checkbox',
  'Edit pencils *',
  'checkbox',
  null,
  (iframeWindow, iframeDocument) => {
    event.target.disabled = true
    // Check if pagelib contains abstraction layer
    if (!iframeWindow.pagelib.c1) {
      const editPencilHeaderFromSectionHeader = sectionHeader =>
        iframeWindow.pagelib.EditTransform.newEditSectionHeader(
          iframeDocument,
          sectionHeader.getAttribute('id'),
          sectionHeader.getAttribute('toclevel'),
          sectionHeader.getAttribute('line')
        )
      const replaceSectionHeaderWithEditPencilHeader = sectionHeader => {
        sectionHeader.parentNode.replaceChild(
          editPencilHeaderFromSectionHeader(sectionHeader),
          sectionHeader
        )
      }
      iframeDocument.querySelectorAll('.section_header')
        .forEach(replaceSectionHeaderWithEditPencilHeader)
    }
  }
]
