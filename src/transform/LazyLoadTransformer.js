import CollapseTable from './CollapseTable'
import ElementUtilities from './ElementUtilities'
import LazyLoadTransform from './LazyLoadTransform'
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
   * @param {!number} loadDistanceMultiplier Images within this multiple of the screen height are
   *                                         loaded in either direction.
   */
  constructor(window, loadDistanceMultiplier) {
    this._window = window
    this._loadDistanceMultiplier = loadDistanceMultiplier

    this._pendingImages = []
    this._registered = false
    this._throttledLoadImages = Throttle.wrap(window, THROTTLE_PERIOD_MILLISECONDS,
      () => this._loadImages())
  }

  /**
   * Convert images with placeholders. Calling this function may register this instance to listen to
   * page events.
   * @param {!Element} element
   * @return {void}
   */
  convertImagesToPlaceholders(element) {
    const images = LazyLoadTransform.queryLazyLoadableImages(element)
    LazyLoadTransform.convertImagesToPlaceholders(this._window.document, images)
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

  /** @return {void} */
  _loadImages() {
    this._pendingImages = this._pendingImages.filter(image => {
      let pending = true
      if (this._isImageEligibleToLoad(image)) {
        LazyLoadTransform.loadImage(this._window.document, image)
        pending = false
      }
      return pending
    })

    if (this._pendingImages.length === 0) {
      this.deregister()
    }
  }

  /**
   * @param {!HTMLSpanElement} image
   * @return {!boolean}
   */
  _isImageEligibleToLoad(image) {
    return ElementUtilities.isVisible(image) && this._isImageWithinLoadDistance(image)
  }

  /**
   * @param {!HTMLSpanElement} image
   * @return {!boolean}
   */
  _isImageWithinLoadDistance(image) {
    const bounds = image.getBoundingClientRect()
    const range = this._window.innerHeight * this._loadDistanceMultiplier
    return !(bounds.top > range || bounds.bottom < -range)
  }
}