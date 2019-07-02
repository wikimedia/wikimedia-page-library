import EditTransform from '../../transform/EditTransform'

/**
 * Change user visible labels in the WebView.
 * @param {!Document} document
 * @param {!{string}} localizedStrings a dictionary of localized strings {
 *   addTitleDescription
 * }
 * @return {void}
 */
const localizeLabels = (document, localizedStrings) => {
  if (localizedStrings.addTitleDescription) {
    const element = document.querySelector(`#${EditTransform.ADD_TITLE_DESCRIPTION}`)
    if (element) {
      element.innerHTML = localizedStrings.addTitleDescription
    }
  }
}

export default {
  localizeLabels
}