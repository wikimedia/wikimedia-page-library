import './FooterLegal.css'

/**
 * @typedef {function} FooterLegalClickCallback
 * @return {void}
 */

/**
 * Adds legal footer html to 'containerID' element.
 * @param {!Element} content
 * @param {?string} licenseString
 * @param {?string} licenseSubstitutionString
 * @param {!string} containerID
 * @param {?FooterLegalClickCallback} licenceLinkClickHandler
 */
const add =
  (content, licenseString, licenseSubstitutionString, containerID, licenceLinkClickHandler) => {
    const container = content.querySelector(`#${containerID}`)
    const licenseStringHalves = licenseString.split('$1')

    container.innerHTML =
  `<div class='footer_legal_contents'>
    <hr class='footer_legal_divider'>
    <span class='footer_legal_licence'>
      ${licenseStringHalves[0]}
      <a class='footer_legal_licence_link'>
        ${licenseSubstitutionString}
      </a>
      ${licenseStringHalves[1]}
    </span>
  </div>`

    container.querySelector('.footer_legal_licence_link')
      .addEventListener('click', () => {
        licenceLinkClickHandler()
      }, false)
  }

export default {
  add
}