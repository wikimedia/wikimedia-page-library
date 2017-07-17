import './FooterMenu.css'
import Polyfill from './Polyfill'

/**
 * @typedef {function} FooterMenuItemPayloadExtractor
 * @param {!Document} document
 * @return {!string[]} Important - should return empty array if no payload strings.
 */

/**
 * @typedef {function} FooterMenuItemClickCallback
 * @param {!string[]} payload Important - should return empty array if no payload strings.
 * @return {void}
 */

/**
 * @typedef {number} MenuItemType
 */

/**
 * Extracts array of no-html page issues strings from document.
 * @type {FooterMenuItemPayloadExtractor}
 */
const pageIssuesStringsArray = document => {
  const tables = Polyfill.querySelectorAll(document,
    'div#content_block_0 table.ambox:not(.ambox-multiple_issues):not(.ambox-notice)'
  )
  // Get the tables into a fragment so we can remove some elements without triggering a layout
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < tables.length; i++) {
    fragment.appendChild(tables[i].cloneNode(true))
  }
  // Remove some element so their text doesn't appear when we use "innerText"
  Polyfill.querySelectorAll(fragment, '.hide-when-compact, .collapsed').forEach(el => el.remove())
  // Get the innerText
  return Polyfill.querySelectorAll(fragment, 'td[class$=mbox-text]').map(el => el.innerText)
}

/**
 * Extracts array of disambiguation page urls from document.
 * @type {FooterMenuItemPayloadExtractor}
 */
const disambiguationTitlesArray = document =>
  Polyfill.querySelectorAll(document,
    'div#content_block_0 div.hatnote a[href]:not([href=""]):not([redlink="1"])'
  ).map(el => el.href)

/**
 * Type representing kinds of menu items.
 * @enum {MenuItemType}
 */
const MenuItemType = {
  languages: 1,
  lastEdited: 2,
  pageIssues: 3,
  disambiguation: 4,
  coordinate: 5
}

/**
 * Menu item model.
 */
class MenuItem {
  /**
   * MenuItem constructor.
   * @param {!string} title
   * @param {?string} subtitle
   * @param {!MenuItemType} itemType
   * @param {FooterMenuItemClickCallback} clickHandler
   * @return {void}
   */
  constructor(title, subtitle, itemType, clickHandler) {
    this.title = title
    this.subtitle = subtitle
    this.itemType = itemType
    this.clickHandler = clickHandler
    this.payload = []
  }

  /**
   * Returns icon CSS class for this menu item based on its type.
   * @return {!string}
   */
  iconClass() {
    switch (this.itemType) {
    case MenuItemType.languages:
      return 'pagelib_footer_menu_icon_languages'
    case MenuItemType.lastEdited:
      return 'pagelib_footer_menu_icon_last_edited'
    case MenuItemType.pageIssues:
      return 'pagelib_footer_menu_icon_page_issues'
    case MenuItemType.disambiguation:
      return 'pagelib_footer_menu_icon_disambiguation'
    case MenuItemType.coordinate:
      return 'pagelib_footer_menu_icon_coordinate'
    default:
      return ''
    }
  }

  /**
   * Returns reference to function for extracting payload when this menu item is tapped.
   * @return {?FooterMenuItemPayloadExtractor}
   */
  payloadExtractor() {
    switch (this.itemType) {
    case MenuItemType.languages:
      return undefined
    case MenuItemType.lastEdited:
      return undefined
    case MenuItemType.pageIssues:
      return pageIssuesStringsArray
    case MenuItemType.disambiguation:
      return disambiguationTitlesArray
    case MenuItemType.coordinate:
      return undefined
    default:
      return undefined
    }
  }
}

/**
 * Makes document fragment for a menu item.
 * @param {!MenuItem} menuItem
 * @param {!Document} document
 * @return {!DocumentFragment}
 */
const documentFragmentForMenuItem = (menuItem, document) => {
  const item = document.createElement('div')
  item.className = 'pagelib_footer_menu_item'

  const containerAnchor = document.createElement('a')
  containerAnchor.addEventListener('click', () => {
    menuItem.clickHandler(menuItem.payload)
  })

  item.appendChild(containerAnchor)

  if (menuItem.title) {
    const title = document.createElement('div')
    title.className = 'pagelib_footer_menu_item_title'
    title.innerText = menuItem.title
    containerAnchor.title = menuItem.title
    containerAnchor.appendChild(title)
  }

  if (menuItem.subtitle) {
    const subtitle = document.createElement('div')
    subtitle.className = 'pagelib_footer_menu_item_subtitle'
    subtitle.innerText = menuItem.subtitle
    containerAnchor.appendChild(subtitle)
  }

  const iconClass = menuItem.iconClass()
  if (iconClass) {
    item.classList.add(iconClass)
  }

  return document.createDocumentFragment().appendChild(item)
}

/**
 * Adds a MenuItem to a container.
 * @param {!MenuItem} menuItem
 * @param {!string} containerID
 * @param {!Document} document
 */
const addItem = (menuItem, containerID, document) => {
  document.getElementById(containerID).appendChild(
    documentFragmentForMenuItem(menuItem, document)
  )
}

/**
 * Conditionally adds a MenuItem to a container.
 * @param {!string} title
 * @param {!string} subtitle
 * @param {!MenuItemType} itemType
 * @param {!string} containerID
 * @param {FooterMenuItemClickCallback} clickHandler
 * @param {!Document} document
 * @return {void}
 */
const maybeAddItem = (title, subtitle, itemType, containerID, clickHandler, document) => {
  const item = new MenuItem(title, subtitle, itemType, clickHandler)

  // Items are not added if they have a payload extractor which fails to extract anything.
  if (item.payloadExtractor()) {
    item.payload = item.payloadExtractor()(document)
    if (item.payload.length === 0) {
      return
    }
  }

  addItem(item, containerID, document)
}

/**
 * Sets heading element string.
 * @param {!string} headingString
 * @param {!string} headingID
 * @param {!Document} document
 */
const setHeading = (headingString, headingID, document) => {
  const headingElement = document.getElementById(headingID)
  headingElement.innerText = headingString
  headingElement.title = headingString
}

export default {
  MenuItemType,
  setHeading,
  maybeAddItem
}