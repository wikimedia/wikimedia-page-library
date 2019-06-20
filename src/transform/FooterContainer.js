import './FooterContainer.css'

/**
 * Returns a fragment containing structural footer html which may be inserted where needed.
 * @param {!Document} document
 * @return {!DocumentFragment}
 */
const containerFragment = document => {
  const containerFragment = document.createDocumentFragment()
  const menuSection = document.createElement('section')
  menuSection.id = 'pagelib_footer_container_section_0'
  menuSection.innerHTML =
  `<h2 id='pagelib_footer_container_menu_heading' class='pagelib_footer_container_heading'></h2>
   <div id='pagelib_footer_container_menu_items'></div>`
  containerFragment.appendChild(menuSection)
  const readMoreSection = document.createElement('section')
  readMoreSection.id = 'pagelib_footer_container_readmore'
  readMoreSection.innerHTML =
  `<h2 id='pagelib_footer_container_readmore_heading' class='pagelib_footer_container_heading'></h2>
   <div id='pagelib_footer_container_readmore_pages'></div>`
  containerFragment.appendChild(readMoreSection)
  const legalSection = document.createElement('section')
  legalSection.id = 'pagelib_footer_container_legal'
  containerFragment.appendChild(legalSection)
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
  isContainerAttached // todo: rename isAttached()?
}