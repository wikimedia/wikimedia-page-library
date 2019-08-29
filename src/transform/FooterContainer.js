import './FooterContainer.css'

/**
 * Returns a fragment containing structural footer html which may be inserted where needed.
 * @param {!Document} document
 * @param {!Object.<any>} fragments object containing fragments names for each section
 * @return {!DocumentFragment}
 */
const containerFragment = (document, fragments) => {
  const containerFragment = document.createDocumentFragment()
  const menuSection = document.createElement('section')
  menuSection.id = 'pagelib_footer_container_menu'
  menuSection.className = 'pagelib_footer_section'
  menuSection.innerHTML =
  `<h2 id='pagelib_footer_container_menu_heading'></h2>
   <a name=${fragments && fragments.menu}></a>
   <div id='pagelib_footer_container_menu_items'></div>`
  containerFragment.appendChild(menuSection)
  const readMoreSection = document.createElement('section')
  readMoreSection.id = 'pagelib_footer_container_readmore'
  readMoreSection.className = 'pagelib_footer_section'
  readMoreSection.innerHTML =
  `<h2 id='pagelib_footer_container_readmore_heading'></h2>
   <a name=${fragments && fragments.readmore}></a>
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