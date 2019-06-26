import AdjustTextSize from '../../transform/AdjustTextSize'
import BodySpacingTransform from '../../transform/BodySpacingTransform'
import CollapseTable from '../../transform/CollapseTable'
import DimImagesTransform from '../../transform/DimImagesTransform'
import FooterContainer from '../../transform/FooterContainer'
import FooterLegal from '../../transform/FooterLegal'
import FooterMenu from '../../transform/FooterMenu'
import FooterReadMore from '../../transform/FooterReadMore'
import LazyLoadTransformer from '../../transform/LazyLoadTransformer'
import PlatformTransform from '../../transform/PlatformTransform'
import Scroller from './Scroller'
import ThemeTransform from '../../transform/ThemeTransform'

/**
 * Executes common JS functionality the client should start, like hooking up events for
 * lazy loading and table collapsing/expanding.
 * Client side complement of server-side DOM transformations.
 * Note: this will be called automatically when DOM is ready
 * @param {!Window} window
 * @param {!Document} document
 * @return {void}
 */
const onPageLoad = (window, document) => {
  const lazyLoader = new LazyLoadTransformer(window, 2)
  lazyLoader.collectExistingPlaceholders(document.body)
  lazyLoader.loadPlaceholders()

  CollapseTable.setupEventHandling(window, document, true, Scroller.scrollWithDecorOffset)
}

/**
 * @typedef {function} OnSuccess
 * @return {void}
 */

/**
 * Makes multiple page modifications based on client specific settings, which should be called
 * during initial page load.
 * @param {!Document} document
 * @param {!{}} settings client settings
 *   { platform, clientVersion, theme, dimImages, margins, areTablesCollapsed, scrollTop,
 *   textSizeAdjustmentPercentage }
 * @param {?PageMods~Function} onSuccess callback
 * @return {void}
 */
const setMulti = (document, settings, onSuccess) => {
  if (settings.platform !== undefined) {
    PlatformTransform.setPlatform(document, settings.platform)
  }
  if (settings.theme !== undefined) {
    ThemeTransform.setTheme(document, settings.theme)
  }
  if (settings.dimImages !== undefined) {
    DimImagesTransform.dimImages(document, settings.dimImages)
  }
  if (settings.margins !== undefined) {
    BodySpacingTransform.setMargins(document.body, settings.margins)
  }
  if (settings.areTablesCollapsed) {
    CollapseTable.toggleCollapsedForAll(document.body)
  }
  if (settings.scrollTop !== undefined) {
    Scroller.setScrollTop(settings.scrollTop)
  }
  if (settings.textSizeAdjustmentPercentage !== undefined) {
    AdjustTextSize.setPercentage(
      document.body,
      settings.textSizeAdjustmentPercentage
    )
  }

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Sets the theme.
 * @param {!Document} document
 * @param {!string} theme one of the values in Themes
 * @param {?OnSuccess} onSuccess callback
 * @return {void}
 */
const setTheme = (document, theme, onSuccess) => {
  ThemeTransform.setTheme(document, theme)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Toggles dimming of images.
 * @param {!Document} document
 * @param {!boolean} dimImages true if images should be dimmed, false otherwise
 * @param {?OnSuccess} onSuccess callback
 * @return {void}
 */
const setDimImages = (document, dimImages, onSuccess) => {
  DimImagesTransform.dimImages(document, dimImages)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Sets the margins.
 * @param {!Document} document
 * @param {!{BodySpacingTransform.Spacing}} margins
 * @param {?OnSuccess} onSuccess callback
 * @return {void}
 */
const setMargins = (document, margins, onSuccess) => {
  BodySpacingTransform.setMargins(document.body, margins)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Sets the top scroll position for collapsing of tables (when bottom close button is tapped).
 * @param {!Document} document
 * @param {!number} scrollTop height of decor covering the top portion of the Viewport in pixel
 * @param {?OnSuccess} onSuccess callback
 * @return {void}
 */
const setScrollTop = (document, scrollTop, onSuccess) => {
  Scroller.setScrollTop(scrollTop)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Sets text size adjustment percentage of the body element
 * @param  {!Document} document
 * @param  {!string} textSize percentage for text-size-adjust in format of string, like '100%'
 * @param  {?OnSuccess} onSuccess onSuccess callback
 * @return {void}
 */
const setTextSizeAdjustmentPercentage = (document, textSize, onSuccess) => {
  AdjustTextSize.setPercentage(document.body, textSize)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Adds footer to the end of the document
 * @param  {!Document} document
 * @param  {!list} articleTitle article title for related pages
 * @param  {!string} menuItems menu items to add
 * @param  {!map} localizedStrings localized strings
 * @param  {!number} readMoreItemCount number of read more items to add
 * @param  {!string} readMoreBaseURL base url for restbase to fetch read more
 * @return {void}
 */
const addFooter = (
  document,
  articleTitle,
  menuItems,
  localizedStrings,
  readMoreItemCount,
  readMoreBaseURL
) => {
  // Add container
  if (FooterContainer.isContainerAttached(document) === false) {
    document.body.appendChild(FooterContainer.containerFragment(document))
  }
  // Add menu
  FooterMenu.setHeading(
    localizedStrings.menuHeading,
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
      title = localizedStrings.menuLanguagesTitle
      break
    case FooterMenu.MenuItemType.lastEdited:
      menuItemTypeString = 'lastEdited'
      title = localizedStrings.menuLastEditedTitle
      subtitle = localizedStrings.menuLastEditedSubtitle
      break
    case FooterMenu.MenuItemType.pageIssues:
      menuItemTypeString = 'pageIssues'
      title = localizedStrings.menuPageIssuesTitle
      break
    case FooterMenu.MenuItemType.disambiguation:
      menuItemTypeString = 'disambiguation'
      title = localizedStrings.menuDisambiguationTitle
      break
    case FooterMenu.MenuItemType.coordinate:
      menuItemTypeString = 'coordinate'
      title = localizedStrings.menuCoordinateTitle
      break
    case FooterMenu.MenuItemType.talkPage:
      menuItemTypeString = 'talkPage'
      title = localizedStrings.menuTalkPageTitle
      break
    default:
    }
    /**
    * @param {!map} payload menu item payload
    * @return {void}
    */
    const itemSelectionHandler = payload => { // TODO: interaction handling
      console.log(menuItemTypeString + JSON.stringify(payload)) // eslint-disable-line no-console
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
      localizedStrings.readMoreHeading,
      'pagelib_footer_container_readmore_heading',
      document
    )
    /**
    * @param {!string} title article title
    * @return {void}
    */
    const saveButtonTapHandler = title => { } // TODO: interaction handling
    /**
    * @param {!list} titles article titles
    * @return {void}
    */
    const titlesShownHandler = titles => { } // TODO: interaction handling
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
  const licenseLinkClickHandler = () => { } // TODO: interaction handling
  /**
  * @return {void}
  */
  const viewInBrowserLinkClickHandler =  { } // TODO: interaction handling
  FooterLegal.add(
    document,
    localizedStrings.licenseString,
    localizedStrings.licenseSubstitutionString,
    'pagelib_footer_container_legal',
    licenseLinkClickHandler,
    localizedStrings.viewInBrowserString,
    viewInBrowserLinkClickHandler
  )
}

/**
 * Gets the Scroller object. Just for testing!
 * @return {{setScrollTop, scrollWithDecorOffset}}
 */
const getScroller = () => Scroller

// automatically invoked when DOM is ready
document.addEventListener('DOMContentLoaded', () => onPageLoad(window, document))

export default {
  onPageLoad,
  setMulti,
  setTheme,
  setDimImages,
  setMargins,
  setScrollTop,
  setTextSizeAdjustmentPercentage,
  addFooter,
  testing: {
    getScroller
  }
}