/* eslint-disable require-jsdoc */

const platformSelectionHandler = (iframeWindow, iframeDocument, selectedValue) => {
  const html = iframeDocument.firstElementChild
  /* eslint-disable multiline-ternary */
  const platformClass = iframeWindow.pagelib.c1
    ? iframeWindow.pagelib.c1.Platforms
    : iframeWindow.pagelib.PlatformTransform.CLASS
  html.classList.remove(platformClass.ANDROID)
  html.classList.remove(platformClass.IOS)
  if (selectedValue in platformClass) {
    html.classList.add(platformClass[selectedValue])
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
