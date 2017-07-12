import './FooterContainer.css'

/**
 * Ensures the 'Read more' section header can always be scrolled to the top of the screen.
 * @param {!Document} document
 * @param {!Window} window
 * @return {void}
 */
const updateBottomPaddingToAllowReadMoreToScrollToTop = (document, window) => {
  const div = document.getElementById('footer_container_ensure_can_scroll_to_top')
  let currentPadding = parseInt(div.style.paddingBottom, 10)
  if (isNaN(currentPadding)) { currentPadding = 0 }
  const height = div.clientHeight - currentPadding
  const newPadding = Math.max(0, window.innerHeight - height)
  div.style.paddingBottom = `${newPadding}px`
}

/**
 * Allows native code to adjust footer container margins without having to worry about
 * implementation details.
 * @param {!Document} document
 * @param {!number} margin
 * @return {void}
 */
const updateLeftAndRightMargin = (document, margin) => {
  const elements = document.querySelectorAll(
    '#footer_container_menu_heading, #footer_container_readmore, #footer_container_legal'
  )
  Array.from(elements)
    .forEach(element => {
      element.style.marginLeft = `${margin}px`
      element.style.marginRight = `${margin}px`
    })
  const rightOrLeft = document.querySelector('html').dir === 'rtl' ? 'right' : 'left'
  Array.from(document.querySelectorAll('.footer_menu_item'))
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
  `<div id='footer_container' class='footer_container'>
    <div id='footer_container_section_0'>
      <div id='footer_container_menu'>
        <div id='footer_container_menu_heading' class='footer_container_heading'></div>
        <div id='footer_container_menu_items'></div>
      </div>
    </div>
    <div id='footer_container_ensure_can_scroll_to_top'>
      <div id='footer_container_section_1'>
        <div id='footer_container_readmore'>
          <div id='footer_container_readmore_heading' class='footer_container_heading'></div>
          <div id='footer_container_readmore_pages'></div>
        </div>
      </div>
      <div id='footer_container_legal'></div>
    </div>
  </div>`
  return containerFragment
}

/**
 * Indicates whether container is has already been added.
 * @param {!Document} document
 * @return {boolean}
 */
const isContainerAttached = document => document.querySelector('#footer_container') !== null

export default {
  containerFragment,
  isContainerAttached,
  updateBottomPaddingToAllowReadMoreToScrollToTop,
  updateLeftAndRightMargin
}