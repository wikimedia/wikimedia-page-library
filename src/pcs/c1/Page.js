import AdjustTextSize from '../../transform/AdjustTextSize'
import BodySpacingTransform from '../../transform/BodySpacingTransform'
import CollapseTable from '../../transform/CollapseTable'
import DimImagesTransform from '../../transform/DimImagesTransform'
import EditTransform from '../../transform/EditTransform'
import InteractionHandling from './InteractionHandling'
import L10N from './L10N'
import LazyLoadTransformer from '../../transform/LazyLoadTransformer'
import PlatformTransform from '../../transform/PlatformTransform'
import Scroller from './Scroller'
import ThemeTransform from '../../transform/ThemeTransform'

/**
 * @typedef {function} OnSuccess
 * @return {void}
 */

/**
 * Makes multiple page modifications based on client specific settings, which should be called
 * during initial page load.
 * @param {?{}} optionalSettings client settings
 *   { platform, clientVersion, l10n, theme, dimImages, margins, areTablesInitiallyExpanded,
 *   scrollTop, textSizeAdjustmentPercentage }
 * @param {?Page~Function} onSuccess callback
 * @return {void}
 */
const setup = (optionalSettings, onSuccess) => {
  const settings = optionalSettings || {}
  if (settings.platform !== undefined) {
    PlatformTransform.setPlatform(document, settings.platform)
  }
  if (settings.l10n !== undefined) {
    L10N.localizeLabels(settings.l10n)
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
  if (settings.areTablesInitiallyExpanded) {
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
  if (settings.loadImages === undefined || settings.loadImages === true) {
    const lazyLoader = new LazyLoadTransformer(window, 2)
    lazyLoader.collectExistingPlaceholders(document.body)
    lazyLoader.loadPlaceholders()
  }

  if (onSuccess instanceof Function) {
    if (window && window.requestAnimationFrame) {
      // request animation frame before callback to ensure theme is set
      window.requestAnimationFrame(() => {
        onSuccess()
      })
    } else {
      onSuccess()
    }
  }
}

/**
 * Sets the theme.
 * @param {!string} theme one of the values in Themes
 * @param {?OnSuccess} onSuccess callback
 * @return {void}
 */
const setTheme = (theme, onSuccess) => {
  ThemeTransform.setTheme(document, theme)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Toggles dimming of images.
 * @param {!boolean} dimImages true if images should be dimmed, false otherwise
 * @param {?OnSuccess} onSuccess callback
 * @return {void}
 */
const setDimImages = (dimImages, onSuccess) => {
  DimImagesTransform.dimImages(document, dimImages)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Sets the margins.
 * @param {!{BodySpacingTransform.Spacing}} margins
 * @param {?OnSuccess} onSuccess callback
 * @return {void}
 */
const setMargins = (margins, onSuccess) => {
  BodySpacingTransform.setMargins(document.body, margins)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Sets the top scroll position for collapsing of tables (when bottom close button is tapped).
 * @param {!number} scrollTop height of decor covering the top portion of the Viewport in pixel
 * @param {?OnSuccess} onSuccess callback
 * @return {void}
 */
const setScrollTop = (scrollTop, onSuccess) => {
  Scroller.setScrollTop(scrollTop)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Sets text size adjustment percentage of the body element
 * @param  {!string} textSize percentage for text-size-adjust in format of string, like '100%'
 * @param  {?OnSuccess} onSuccess onSuccess callback
 * @return {void}
 */
const setTextSizeAdjustmentPercentage = (textSize, onSuccess) => {
  AdjustTextSize.setPercentage(document.body, textSize)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Enables edit buttons to be shown (and which ones).
 * @param {?boolean} isEditable true if edit buttons should be shown
 * @param {?boolean} isProtected true if the protected edit buttons should be shown
 * @param {?OnSuccess} onSuccess onSuccess callback
 * @return {void}
 */
const setEditButtons = (isEditable, isProtected, onSuccess) => {
  EditTransform.setEditButtons(document, isEditable, isProtected)

  if (onSuccess instanceof Function) {
    onSuccess()
  }
}

/**
 * Gets the revision of the current mobile-html page.
 * @return {string}
 */
const getRevision = () => {
  const about = document.documentElement.getAttribute('about')
  return about.substring(about.lastIndexOf('/') + 1)
}

/**
 * Gets the Scroller object. Just for testing!
 * @return {{setScrollTop, scrollWithDecorOffset}}
 */
const getScroller = () => Scroller

/**
 * Executes pagelib functionality intended to run before any content has loaded
 * @return {void}
 */
const onBodyStart = () => {
  // eslint-disable-next-line no-undef
  if (typeof pcsClient !== 'undefined' && pcsClient.getSetupSettings) {
    // eslint-disable-next-line no-undef
    const setupJSON = pcsClient.getSetupSettings()
    document.pcsSetupSettings = JSON.parse(setupJSON)
  }
  // eslint-disable-next-line no-undef
  if (typeof pcsClient !== 'undefined' && pcsClient.onReceiveMessage) {
    document.pcsActionHandler = action => {
      // eslint-disable-next-line no-undef
      pcsClient.onReceiveMessage(JSON.stringify(action))
    }
  }
  if (document && document.pcsActionHandler) {
    InteractionHandling.setInteractionHandler(document.pcsActionHandler)
  }

  if (document && document.pcsSetupSettings) {
    const preSettings = {
      theme: document.pcsSetupSettings.theme,
      margins: document.pcsSetupSettings.margins,
      loadImages: false
    }
    setup(preSettings, () => {
      InteractionHandling.initialSetupComplete()
    })
  }
}

/**
 * Executes pagelib functionality intended to run after all content has loaded
 * @return {void}
 */
const onBodyEnd = () => {
  let remainingContentTimeout = 100

  /**
   * Executed when final setup is complete
   * @return {void}
   */
  const finalSetupComplete = () => {
    CollapseTable.setupEventHandling(window, document, true, Scroller.scrollWithDecorOffset)
    InteractionHandling.finalSetupComplete()
  }
  if (document && document.pcsSetupSettings) {
    const postSettings = document.pcsSetupSettings
    delete postSettings.theme
    delete postSettings.margins
    setup(postSettings, finalSetupComplete)
    remainingContentTimeout = document.pcsSetupSettings.remainingTimeout || remainingContentTimeout
  } else {
    setup({}, finalSetupComplete)
  }

  setTimeout(() => {
    const sections = document.querySelectorAll('section')
    for (let i = 1; i < sections.length; i++) {
      sections[i].style.display = ''
    }
  }, remainingContentTimeout)
}

export default {
  onBodyStart,
  onBodyEnd,
  setup,
  setTheme,
  setDimImages,
  setMargins,
  setScrollTop,
  setTextSizeAdjustmentPercentage,
  setEditButtons,
  getRevision,
  testing: {
    getScroller
  }
}