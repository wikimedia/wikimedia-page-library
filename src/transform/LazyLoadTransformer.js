import CollapseTable from './CollapseTable'
import ElementUtilities from './ElementUtilities'
import LazyLoadTransform from './LazyLoadTransform'
import Rectangle from './Rectangle'
import Throttle from './Throttle'

const EVENT_TYPES = ['scroll', 'resize', CollapseTable.SECTION_TOGGLED_EVENT_TYPE]
const THROTTLE_PERIOD_MILLISECONDS = 100

/**
 * This class subscribes to key page events, applying lazy load transforms or inversions as
 * applicable. It has external dependencies on the section-toggled custom event and the following
 * standard browser events: resize, scroll.
 */
export default class {
  /**
   * @param {!Window} window
   * @param {!number} loadDistanceMultiplier viewport distance multiplier.
   */
  constructor(window, loadDistanceMultiplier) {
    this._window = window

    this._pendingImages = []
    this._registered = false
    this._throttledLoadImages = Throttle.wrap(window, THROTTLE_PERIOD_MILLISECONDS, () =>
      this._loadImages(this._newLoadEligibilityRectangle(loadDistanceMultiplier)))
  }

  /**
   * Replace images with placeholders. Calling this function may register this instance to listen to
   * page events.
   * @param {!Element} element
   * @return {void}
   */
  transform(element) {
    const images = LazyLoadTransform.queryTransformImages(element)
    LazyLoadTransform.transform(this._window.document, images)
    this._pendingImages = this._pendingImages.concat(images)
    this._register()
  }

  /**
   * Manually trigger a load images check. Calling this function may deregister this instance from
   * listening to page events.
   * @return {void}
   */
  loadImages() { this._throttledLoadImages() }

  /**
   * This method may be safely called even when already unregistered. This function clears the
   * record of placeholders.
   * @return {void}
   */
  deregister() {
    if (!this._registered) { return }

    EVENT_TYPES.forEach(eventType =>
      this._window.removeEventListener(eventType, this._throttledLoadImages))

    this._pendingImages = []
    this._registered = false
  }

  /**
   * This method may be safely called even when already registered.
   * @return {void}
   */
  _register() {
    if (this._registered || !this._pendingImages.length) { return }
    this._registered = true

    EVENT_TYPES.forEach(eventType =>
      this._window.addEventListener(eventType, this._throttledLoadImages))
  }

  /**
   * @param {!Rectangle} viewport
   * @return {void}
   */
  _loadImages(viewport) {
    this._pendingImages = this._pendingImages.filter(placeholder => {
      let pending = true
      if (this._isImageEligibleToLoad(placeholder, viewport)) {
        LazyLoadTransform.loadImage(this._window.document, placeholder)
        pending = false
      }
      return pending
    })

    if (this._pendingImages.length === 0) {
      this.deregister()
    }
  }

  /**
   * @param {!HTMLSpanElement} placeholder
   * @param {!Rectangle} viewport
   * @return {!boolean}
   */
  _isImageEligibleToLoad(placeholder, viewport) {
    return ElementUtilities.isVisible(placeholder)
      && ElementUtilities.intersectsViewportRectangle(placeholder, viewport)
  }

  /**
   * @return {!Rectangle} The boundaries for images eligible to load relative the viewport. Images
   *                      within these boundaries may already be loading or loaded; images outside
   *                      of these boundaries should not be loaded as they're ineligible, however,
   *                      they may have previously been loaded.
   */
  _newLoadEligibilityRectangle(loadDistanceMultiplier) {
    const x = 0
    const y = 0
    const width = this._window.innerWidth * loadDistanceMultiplier
    const height = this._window.innerHeight * loadDistanceMultiplier
    return new Rectangle(y, x + width, y + height, x)
  }
}