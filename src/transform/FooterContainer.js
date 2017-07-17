import './FooterContainer.css'
import Polyfill from './Polyfill'

/**
 * Ensures the 'Read more' section header can always be scrolled to the top of the screen.
 * @param {!Window} window
 * @return {void}
 */
const updateBottomPaddingToAllowReadMoreToScrollToTop = window => {
  const div = window.document.getElementById('pagelib_footer_container_ensure_can_scroll_to_top')
  const currentPadding = parseInt(div.style.paddingBottom, 10) || 0
  const height = div.clientHeight - currentPadding
  const newPadding = Math.max(0, window.innerHeight - height)
  div.style.paddingBottom = `${newPadding}px`
}

/**
 * Allows native code to adjust footer container margins without having to worry about
 * implementation details.
 * @param {!number} margin
 * @param {!Document} document
 * @return {void}
 */
const updateLeftAndRightMargin = (margin, document) => {
  const elements = Polyfill.querySelectorAll(document, `
    #pagelib_footer_container_menu_heading, 
    #pagelib_footer_container_readmore, 
    #pagelib_footer_container_legal
  `)
  elements.forEach(element => {
    element.style.marginLeft = `${margin}px`
    element.style.marginRight = `${margin}px`
  })
  const rightOrLeft = document.querySelector('html').dir === 'rtl' ? 'right' : 'left'
  Polyfill.querySelectorAll(document, '.pagelib_footer_menu_item')
    .forEach(element => {
      element.style.backgroundPosition = `${rightOrLeft} ${margin}px center`
      element.style.paddingLeft = `${margin}px`
      element.style.paddingRight = `${margin}px`
    })
}

/**
 * Returns a fragment containing structural footer html which may be inserted where needed.
 * @param {!Document} document
 * @return {!DocumentFragment}
 */
const containerFragment = document => {
  const containerDiv = document.createElement('div')
  const containerFragment = document.createDocumentFragment()
  containerFragment.appendChild(containerDiv)
  containerDiv.innerHTML =
  `<div id='pagelib_footer_container' class='pagelib_footer_container'>
    <div id='pagelib_footer_container_section_0'>
      <div id='pagelib_footer_container_menu'>
        <div id='pagelib_footer_container_menu_heading' class='pagelib_footer_container_heading'>
        </div>
        <div id='pagelib_footer_container_menu_items'>
        </div>
      </div>
    </div>
    <div id='pagelib_footer_container_ensure_can_scroll_to_top'>
      <div id='pagelib_footer_container_section_1'>
        <div id='pagelib_footer_container_readmore'>
          <div 
            id='pagelib_footer_container_readmore_heading' class='pagelib_footer_container_heading'>
          </div>
          <div id='pagelib_footer_container_readmore_pages'>
          </div>
        </div>
      </div>
      <div id='pagelib_footer_container_legal'></div>
    </div>
  </div>`
  return containerFragment
}

/**
 * Indicates whether container is has already been added.
 * @param {!Document} document
 * @return {boolean}
 */
const isContainerAttached = document => Boolean(document.querySelector('#pagelib_footer_container'))

export default {
  containerFragment,
  isContainerAttached,
  updateBottomPaddingToAllowReadMoreToScrollToTop,
  updateLeftAndRightMargin
}