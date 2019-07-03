import EditTransform from '../../transform/EditTransform'

const selectors = {
  addTitleDescription: `#${EditTransform.ADD_TITLE_DESCRIPTION}`,
}

/**
 * Change user visible labels in the WebView.
 * @param {!Document} document
 * @param {!{string}} localizedStrings a dictionary of localized strings {
 *   addTitleDescription
 * }
 * @return {void}
 */
const localizeLabels = (document, localizedStrings) => {
  for (const [key, selector] of Object.entries(selectors)) {
    if (localizedStrings[key]) {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => {
        element.innerHTML = localizedStrings[key]
      })
    }
  }
}

export default {
  localizeLabels
}