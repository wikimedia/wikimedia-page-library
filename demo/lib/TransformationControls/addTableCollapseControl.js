/* eslint-disable require-jsdoc */

export default [
  'collapse_tables_checkbox',
  'Collapse tables *',
  'checkbox',
  null,
  (iframeWindow, iframeDocument) => {
    event.target.disabled = true
    iframeWindow.pagelib.CollapseTable.collapseTables(
      iframeWindow, iframeDocument, 'page title', false, 'Infobox', 'Information', 'Close', null
    )
  }
]
