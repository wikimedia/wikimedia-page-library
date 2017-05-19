const SCROLL_EVENT_TYPE = 'scroll'

/**
 * This class provides a mechanism to subscribe to rate limited scroll events. The events emitted
 * occur at a maximum frequency of the display refresh rate.
 */
export default class ThrottledScrollEventEmitter {
  /** @return {!string} */
  static get DEFAULT_EVENT_TYPE() { return 'scroll:throttled' }

  /**
   * @param {!Window} window A dependency of the throttle mechanism.
   * @param {?EventTarget} eventTarget The target to subscribe to scroll events and post throttled
   *                                   scroll events to, window if unspecified.
   * @param {?Event} throttledScrollEvent Event to be emitted. If unspecified, a "scroll:throttled"
   *                                      CustomEvent if unspecified.   */
  constructor(window, eventTarget, throttledScrollEvent) {
    this._frameRequestId = 0
    this._throttled = false
    this._window = window
    this._eventTarget = eventTarget || window
    this._throttledScrollEvent = throttledScrollEvent
      || new CustomEvent(ThrottledScrollEventEmitter.DEFAULT_EVENT_TYPE)
    this._onScrollCallback = () => this._onScroll()
  }

  /** @return {void} */
  register() { this._eventTarget.addEventListener(SCROLL_EVENT_TYPE, this._onScrollCallback) }

  /** @return {void} */
  deregister() {
    if (this._frameRequestId) {
      this._window.cancelAnimationFrame(this._frameRequestId)
      this._frameRequestId = 0
      this._throttled = false
    }

    this._eventTarget.removeEventListener(SCROLL_EVENT_TYPE, this._onScrollCallback)
  }

  /** @return {void} */
  _onScroll() {
    if (!this._throttled) {
      this._frameRequestId = this._window.requestAnimationFrame(() => {
        this._eventTarget.dispatchEvent(this._throttledScrollEvent)
        this._throttled = false
      })
    }
    this._throttled = true
  }
}