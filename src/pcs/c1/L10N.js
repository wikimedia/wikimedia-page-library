import EditTransform from '../../transform/EditTransform'

/**
 * Change user visible labels in the WebView.
 * @param {!Document} document
 * @param {!{string}} localizedStrings a dictionary of localized strings {
 *   add_title_description
 * }
 * @return {void}
 */
const localizeLabels = (document, localizedStrings) => {
  if (localizedStrings.add_title_description) {
    document.querySelector(
      `[${EditTransform.DATA_ATTRIBUTE.ACTION}=${EditTransform.ACTION_ADD_TITLE_DESCRIPTION}]`)
      .innerHTML = localizedStrings.add_title_description
  }
}

export default {
  localizeLabels
}