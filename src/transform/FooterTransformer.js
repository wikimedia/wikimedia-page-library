import FooterContainer from './FooterContainer'
import FooterLegal from './FooterLegal'
import FooterReadMore from './FooterReadMore'
import Throttle from './Throttle'

const RESIZE_EVENT_TYPE = 'resize'
const RESIZE_LISTENER_THROTTLE_PERIOD_MILLISECONDS = 100

const ID_CONTAINER = 'pagelib_footer_container'
const ID_LEGAL_CONTAINER = 'pagelib_footer_container_legal'

const ID_READ_MORE_CONTAINER = 'pagelib_footer_container_readmore_pages'
const ID_READ_MORE_HEADER = 'pagelib_footer_container_readmore_heading'

/** */
export default class {
  /** */
  constructor() {
    this._resizeListener = undefined
  }

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

    this._resizeListener = Throttle.wrap(window, RESIZE_LISTENER_THROTTLE_PERIOD_MILLISECONDS,
      () => FooterContainer.updateBottomPaddingToAllowReadMoreToScrollToTop(window))
    window.addEventListener(RESIZE_EVENT_TYPE, this._resizeListener)
  }

  /**
   * @param {!Window} window
   * @return {void}
   */
  remove(window) {
    if (this._resizeListener) {
      window.removeEventListener(RESIZE_EVENT_TYPE, this._resizeListener)
      this._resizeListener.cancel()
      this._resizeListener = undefined
    }

    const footer = window.document.getElementById(ID_CONTAINER)
    if (footer) {
      // todo: support recycling.
      footer.parentNode.removeChild(footer)
    }
  }
}