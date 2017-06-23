import Throttle from './Throttle'

/** This class provides a mechanism to subscribe to rate limited events. */
export default class {
  /**
   * @param {!Window} window A dependency of the throttle mechanism.
   * @param {!number} period The nonnegative minimum number of milliseconds between publishing
   *                         events.
   */
  constructor(window, period) {
    this._throttle = Throttle.wrap(window, period, () =>
      this._eventTarget.dispatchEvent(this._publishEvent))

    this._eventTarget = undefined
    this._subscribeEventType = undefined
    this._publishEvent = undefined
  }

  /**
   * @param {!EventTarget} eventTarget The target to subscribe to events from and publish throttled
   *                                   events to.
   * @param {!string} subscribeEventType The input event type to listen for.
   * @param {!Event} publishEvent The output event to post.
   * @return {void}
   */
  register(eventTarget, subscribeEventType, publishEvent) {
    this._eventTarget = eventTarget
    this._subscribeEventType = subscribeEventType
    this._publishEvent = publishEvent
    this._eventTarget.addEventListener(subscribeEventType, this._throttle)
  }

  /** @return {!boolean} */
  registered() { return Boolean(this._eventTarget) }

  /**
   * This method may be safely called even when unregistered.
   * @return {void}
   */
  deregister() {
    if (!this.registered()) { return }

    this._eventTarget.removeEventListener(this._subscribeEventType, this._throttle)
    this._publishEvent = undefined
    this._subscribeEventType = undefined
    this._eventTarget = undefined

    this._throttle.reset()
  }
}