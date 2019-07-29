import FooterContainer from '../../transform/FooterContainer'
import FooterLegal from '../../transform/FooterLegal'
import FooterMenu from '../../transform/FooterMenu'
import FooterReadMore from '../../transform/FooterReadMore'

let handlers

/**
 * Sets up the interaction handlers for the footer.
 * @param {!{}} newHandlers an object with handlers for {
 *   titlesRetrieved, footerItemSelected, saveOtherPage, viewLicense, viewInBrowser
 * }
 * @return {void}
 */
const _connectHandlers = newHandlers => {
  handlers = newHandlers
}

/**
 * Adds footer to the end of the document
 * @param {!Object.<any>} params parameters as follows
 *   {!string} title article title for related pages
 *   {!array<string>} menuItems menu items to add
 *   {!map} l10n localized strings
 *   {!number} readMoreItemCount number of read more items to add
 *   {!string} readMoreBaseURL base url for RESTBase to fetch read more
 * @return {void}
 */
const add = params => {
  const { title: articleTitle, menuItems, l10n,
    readMore: { itemCount: readMoreItemCount, baseURL: readMoreBaseURL } }
    = params

  // Add container
  if (FooterContainer.isContainerAttached(document) === false) {
    document.body.appendChild(FooterContainer.containerFragment(document))
  }
  // Add menu
  FooterMenu.setHeading(
    l10n.menuHeading,
    'pagelib_footer_container_menu_heading',
    document
  )
  menuItems.forEach(item => {
    let title = ''
    let subtitle = ''
    let menuItemTypeString = ''
    switch (item) {
    case FooterMenu.MenuItemType.languages:
      menuItemTypeString = 'languages'
      title = l10n.menuLanguagesTitle
      break
    case FooterMenu.MenuItemType.lastEdited:
      menuItemTypeString = 'lastEdited'
      title = l10n.menuLastEditedTitle
      subtitle = l10n.menuLastEditedSubtitle
      break
    case FooterMenu.MenuItemType.pageIssues:
      menuItemTypeString = 'pageIssues'
      title = l10n.menuPageIssuesTitle
      break
    case FooterMenu.MenuItemType.disambiguation:
      menuItemTypeString = 'disambiguation'
      title = l10n.menuDisambiguationTitle
      break
    case FooterMenu.MenuItemType.coordinate:
      menuItemTypeString = 'coordinate'
      title = l10n.menuCoordinateTitle
      break
    case FooterMenu.MenuItemType.talkPage:
      menuItemTypeString = 'talkPage'
      title = l10n.menuTalkPageTitle
      break
    default:
    }

    /**
     * @param {!map} payload menu item payload
     * @return {void}
     */
    const itemSelectionHandler = payload => {
      if (handlers) {
        handlers.footerItemSelected(menuItemTypeString, payload)
      }
    }

    FooterMenu.maybeAddItem(
      title,
      subtitle,
      item,
      'pagelib_footer_container_menu_items',
      itemSelectionHandler,
      document
    )
  })

  if (readMoreItemCount && readMoreItemCount > 0) {
    FooterReadMore.setHeading(
      l10n.readMoreHeading,
      'pagelib_footer_container_readmore_heading',
      document
    )

    /**
     * @param {!string} title article title
     * @return {void}
     */
    const saveButtonTapHandler = title => {
      if (handlers) {
        handlers.saveOtherPage(title)
      }
    }

    /**
     * @param {!list} titles article titles
     * @return {void}
     */
    const titlesShownHandler = titles => {
      if (handlers) {
        handlers.titlesRetrieved(titles)
      }
    }

    FooterReadMore.add(
      articleTitle,
      readMoreItemCount,
      'pagelib_footer_container_readmore_pages',
      readMoreBaseURL,
      saveButtonTapHandler,
      titlesShownHandler,
      document
    )
  }

  /**
   * @return {void}
   */
  const licenseLinkClickHandler = () => {
    if (handlers) {
      handlers.viewLicense()
    }
  }

  /**
   * @return {void}
   */
  const viewInBrowserLinkClickHandler = () => {
    if (handlers) {
      handlers.viewInBrowser()
    }
  }

  FooterLegal.add(
    document,
    l10n.licenseString,
    l10n.licenseSubstitutionString,
    'pagelib_footer_container_legal',
    licenseLinkClickHandler,
    l10n.viewInBrowserString,
    viewInBrowserLinkClickHandler
  )
}

/**
 * Updates save button text and bookmark icon for saved state in 'Read more' items.
 * Safe to call even for titles for which there is not currently a 'Read more' item.
 * @param {!string} title read more entry title
 * @param {!string} text label indicating saved state
 * @param {!boolean} isSaved
 * @return {void}
 */
const updateReadMoreSaveButtonForTitle = (title, text, isSaved) => {
  FooterReadMore.updateSaveButtonForTitle(title, text, isSaved, document)
}

export default {
  MenuItemType: FooterMenu.MenuItemType,
  add,
  updateReadMoreSaveButtonForTitle,
  _connectHandlers // to be used internally only
}