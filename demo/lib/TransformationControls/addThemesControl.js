/* eslint-disable require-jsdoc */

const themeSelectionHandler = (iframeWindow, iframeDocument, selectedValue) => {
  iframeWindow.pagelib.ThemeTransform.classifyElements(iframeDocument)
  iframeWindow.pagelib.ThemeTransform.setTheme(
    iframeDocument,
    iframeWindow.pagelib.ThemeTransform.THEME[selectedValue]
  )
}
const div = document.createElement('div')
div.id = 'theme'
div.innerHTML = 'Theme'
document.getElementById('demo_controls').appendChild(div)

export default [
  ['theme_radio', 'Default', 'radio', 'DEFAULT', themeSelectionHandler, div.id],
  ['theme_radio', 'Sepia', 'radio', 'SEPIA', themeSelectionHandler, div.id],
  ['theme_radio', 'Dark', 'radio', 'DARK', themeSelectionHandler, div.id],
  ['theme_radio', 'Black', 'radio', 'BLACK', themeSelectionHandler, div.id],
]
