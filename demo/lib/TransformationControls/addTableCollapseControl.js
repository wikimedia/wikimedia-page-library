/* eslint-disable require-jsdoc */

const collapseTables = (iframeWindow, iframeDocument) => {
  event.target.disabled = true
  if (!iframeWindow.pagelib.c1) {
    iframeWindow.pagelib.CollapseTable.collapseTables(
      iframeWindow, iframeDocument, 'page title', false, 'Infobox', 'Information', 'Close', null
    )
  }
}
export default [
  'collapse_tables_checkbox',
  'Collapse tables *',
  'checkbox',
  null,
  collapseTables,
]
