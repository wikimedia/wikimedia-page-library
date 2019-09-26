/* eslint-disable require-jsdoc */

const selectionHandler = (iframeWindow, iframeDocument, selectedValue) => {
  iframeDocument.firstElementChild.setAttribute('dir', selectedValue)
}

const div = document.createElement('div')
div.id = 'text_direction'
div.innerHTML = 'Text direction'
document.getElementById('demo_controls').appendChild(div)

export default [
  ['dir_radio', 'LTR', 'radio', 'ltr', selectionHandler, div.id],
  ['dir_radio', 'RTL', 'radio', 'rtl', selectionHandler, div.id],
]
