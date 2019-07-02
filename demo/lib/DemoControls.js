/* eslint-disable require-jsdoc */

// Get Transformation Controls
import addCompatibilityControl from './TransformationControls/addCompatibilityControl.js'
import addDimImagesControl from './TransformationControls/addDimImagesControl.js'
import addEditPencilsControl from './TransformationControls/addEditPencilsControl.js'
import addFooterControl from './TransformationControls/addFooterControl.js'
import addHideRedlinksControl from './TransformationControls/addHideRedlinksControl.js'
import addLeadIntroductionControl from './TransformationControls/addLeadIntroductionControl.js'
import addPlatformsControl from './TransformationControls/addPlatformsControl.js'
import addTableCollapseControl from './TransformationControls/addTableCollapseControl.js'
import addTextDirectionControl from './TransformationControls/addTextDirectionControl.js'
import addThemesControl from './TransformationControls/addThemesControl.js'
// TODO: add addLazyImageLoadControl
import util from './util.js'
const { expandIframeHeight } = util

let ClosureManager

const transformationControls = [
  addDimImagesControl,
  addFooterControl,
  addTableCollapseControl,
  addEditPencilsControl,
  addCompatibilityControl,
  addHideRedlinksControl,
  addLeadIntroductionControl,
  ...addThemesControl,
  ...addPlatformsControl,
  ...addTextDirectionControl,
]

const configureCheckboxClickToPerformClosureForEachIframe = (checkbox, closure, id) => {
  checkbox.addEventListener('click', event => {
    const value = event.target.value // the closure below only needs to capture the value itself
    const transformApplicationClosure = iframe => {
      closure(iframe.contentWindow, iframe.contentWindow.document, value, iframe)
      expandIframeHeight(iframe)
    }

    // Apply transform to each iframe
    document.querySelectorAll('iframe.article_preview')
      .forEach(transformApplicationClosure)

    // Maintain list of active transforms (transform id mapped to transformApplicationClosure),
    // These activeTransformApplicationClosures are later re-applied to newly loaded articles.
    if (checkbox.checked) {
      ClosureManager.addTransformApplicationClosure(id, transformApplicationClosure)
    } else {
      ClosureManager.addTransformApplicationClosure(id)
    }
  })
}

const addCheckboxToDemoControls = (id, title, type, value, iframeScopeClickClosure,
  sectionId = 'demo_controls') => {
  const checkboxContainer = document.createElement('div')
  checkboxContainer.classList.add('checkbox_container')
  const input = document.createElement('input')
  input.type = type
  input.name = id
  input.value = value
  checkboxContainer.appendChild(input)

  const label = document.createElement('label')
  label.for = id
  label.innerHTML = title
  label.classList.add('checkbox_label')
  checkboxContainer.appendChild(label)

  document.getElementById(sectionId).appendChild(checkboxContainer)

  configureCheckboxClickToPerformClosureForEachIframe(input, iframeScopeClickClosure, id)
}

// eslint-disable-next-line array-callback-return
const addControls = () => {
  // eslint-disable-next-line array-callback-return
  transformationControls.map(transformation => {
    addCheckboxToDemoControls(...transformation)
  })
}

export default function(manager) {
  ClosureManager = manager
  return {
    addControls,
  }
}
