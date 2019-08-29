import FooterContainer from './FooterContainer'
import FooterLegal from './FooterLegal'
import FooterReadMore from './FooterReadMore'

const ID_CONTAINER = 'pagelib_footer_container'
const ID_LEGAL_CONTAINER = 'pagelib_footer_container_legal'

const ID_READ_MORE_CONTAINER = 'pagelib_footer_container_readmore_pages'
const ID_READ_MORE_HEADER = 'pagelib_footer_container_readmore_heading'

/** */
export default class {
  /**
   * @param {!Window} window
   * @param {!Element} container
   * @param {!string} baseURL
   * @param {!string} title
   * @param {!string} readMoreHeader
   * @param {!number} readMoreLimit
   * @param {!string} license
   * @param {!string} licenseSubstitutionString
   * @param {!FooterLegalClickCallback} licenseLinkClickHandler
   * @param {!string} viewInBrowserString
   * @param {!FooterBrowserClickCallback} browserLinkClickHandler
   * @param {!TitlesShownHandler} titlesShownHandler
   * @param {!SaveButtonClickHandler} saveButtonClickHandler
   * @return {void}
   */
  add(window, container, baseURL, title, readMoreHeader, readMoreLimit, license,
    licenseSubstitutionString, licenseLinkClickHandler, viewInBrowserString,
    browserLinkClickHandler, titlesShownHandler,
    saveButtonClickHandler) {
    this.remove(window)
    container.appendChild(FooterContainer.containerFragment(window.document))

    FooterLegal.add(window.document, license, licenseSubstitutionString, ID_LEGAL_CONTAINER,
      licenseLinkClickHandler, viewInBrowserString, browserLinkClickHandler)

    FooterReadMore.setHeading(readMoreHeader, ID_READ_MORE_HEADER, window.document)
    FooterReadMore.add(title, readMoreLimit, ID_READ_MORE_CONTAINER, baseURL,
      saveButtonClickHandler, titles => {
        FooterContainer.updateBottomPaddingToAllowReadMoreToScrollToTop(window)
        titlesShownHandler(titles)
      }, window.document)
  }

  /**
   * @param {!Window} window
   * @return {void}
   */
  remove(window) {
    const footer = window.document.getElementById(ID_CONTAINER)
    if (footer) {
      // todo: support recycling.
      footer.parentNode.removeChild(footer)
    }
  }
}