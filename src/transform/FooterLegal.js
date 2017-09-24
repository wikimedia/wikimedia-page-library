import './FooterLegal.css'

/**
 * @typedef {function} FooterLegalClickCallback
 * @return {void}
 */

/**
  * @typedef {function} FooterBrowserClickCallback
  * @return {void}
  */

/**
 * Adds legal footer html to 'containerID' element.
 * @param {!Element} content
 * @param {?string} licenseString
 * @param {?string} licenseSubstitutionString
 * @param {!string} containerID
 * @param {!FooterLegalClickCallback} licenseLinkClickHandler
 * @param {!string} viewInBrowserString
 * @param {!FooterBrowserClickCallback} browserLinkClickHandler
 * @return {void}
 */
const add = (content, licenseString, licenseSubstitutionString, containerID,
  licenseLinkClickHandler, viewInBrowserString, browserLinkClickHandler) => {
  // todo: don't manipulate the selector. The client can make this an ID if they want it to be.
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
      <br>
      <div class="pagelib_footer_browser">
        <a class='pagelib_footer_browser_link'>
          ${viewInBrowserString}
        </a>
      </div>
    </span>
  </div>`

  container.querySelector('.pagelib_footer_legal_license_link')
    .addEventListener('click', () => {
      licenseLinkClickHandler()
    })

  container.querySelector('.pagelib_footer_browser_link')
    .addEventListener('click', () => {
      browserLinkClickHandler()
    })
}

export default {
  add
}