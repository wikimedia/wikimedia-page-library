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
 * @param {?FooterLegalClickCallback} licenseLinkClickHandler
 */
const add =
  (content, licenseString, licenseSubstitutionString, containerID, licenseLinkClickHandler) => {
    const container = content.querySelector(`#${containerID}`)
    const licenseStringHalves = licenseString.split('$1')

    container.innerHTML =
  `<div class='pagelib_footer_legal_contents'>
    <hr class='pagelib_footer_legal_divider'>
    <span class='pagelib_footer_legal_license'>
      ${licenseStringHalves[0]}
      <a class='pagelib_footer_legal_license_link'>
        ${licenseSubstitutionString}
      </a>
      ${licenseStringHalves[1]}
    </span>
  </div>`

    container.querySelector('.pagelib_footer_legal_license_link')
      .addEventListener('click', () => {
        licenseLinkClickHandler()
      }, false)
  }

export default {
  add
}