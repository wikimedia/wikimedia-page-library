import Throttle from './Throttle'

// todo: rename EventThrottler

/** This class provides a mechanism to subscribe to rate limited events. */
export default class {
  /**
   * @param {!Window} window A dependency of the throttle mechanism.
   * @param {!number} period The nonnegative minimum number of milliseconds between posting events.
   */
  constructor(window, period) {
    this._throttle = Throttle.wrap(window, period, () =>
      this._eventTarget.dispatchEvent(this._postEvent))

    this._eventTarget = undefined
    this._subscribeEventType = undefined
    this._postEvent = undefined
  }

  /**
   * @param {!EventTarget} eventTarget The target to subscribe to events from and post throttled
   *                                   events to.
   * @param {!string} subscribeEventType The input event type to subscribe to.
   * @param {!Event} postEvent The output event to post.
   * @return {void}
   */
  register(eventTarget, subscribeEventType, postEvent) {
    this._eventTarget = eventTarget
    this._subscribeEventType = subscribeEventType
    this._postEvent = postEvent
    this._eventTarget.addEventListener(subscribeEventType, this._throttle)
  }

  /** @return {!boolean} */
  registered() { return Boolean(this._eventTarget) }

  /**
   * This method may safely be called even when unregistered.
   * @return {void}
   */
  deregister() {
    if (!this.registered()) { return }

    this._eventTarget.removeEventListener(this._subscribeEventType, this._throttle)
    this._postEvent = undefined
    this._subscribeEventType = undefined
    this._eventTarget = undefined

    this._throttle.reset()
  }
}