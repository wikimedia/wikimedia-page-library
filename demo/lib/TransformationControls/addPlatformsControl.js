/* eslint-disable require-jsdoc */

const platformSelectionHandler = (iframeWindow, iframeDocument, selectedValue) => {
  const html = iframeDocument.querySelector('html')
  html.classList.remove(iframeWindow.pagelib.PlatformTransform.CLASS.ANDROID)
  html.classList.remove(iframeWindow.pagelib.PlatformTransform.CLASS.IOS)
  if (selectedValue in iframeWindow.pagelib.PlatformTransform.CLASS) {
    html.classList.add(iframeWindow.pagelib.PlatformTransform.CLASS[selectedValue])
  }
}

const div = document.createElement('div')
div.id = 'platform'
div.innerHTML = 'Platform'
document.getElementById('demo_controls').appendChild(div)

export default [
  ['platform_radio', 'Unspecified', 'radio', null, platformSelectionHandler, div.id],
  ['platform_radio', 'iOS', 'radio', 'IOS', platformSelectionHandler, div.id],
  ['platform_radio', 'Android', 'radio', 'ANDROID', platformSelectionHandler, div.id],
]
