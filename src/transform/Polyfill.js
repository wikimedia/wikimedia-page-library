/**
 * Polyfill function that tells whether a given element matches a selector.
 * @param {!Element} el Element
 * @param {!string} selector Selector to look for
 * @return {!boolean} Whether the element matches the selector
 */
const matchesSelector = (el, selector) => {
  if (el.matches) {
    return el.matches(selector)
  }
  if (el.matchesSelector) {
    return el.matchesSelector(selector)
  }
  if (el.webkitMatchesSelector) {
    return el.webkitMatchesSelector(selector)
  }
  return false
}

/**
 * setStyleProperty() with a workaround for when the previous property had the important flag set.
 * This issue affects Android KitKat 4.4.2 (API 19), Tracfone LG Ultimate 2 (LGL41C).
 *
 * https://bugs.chromium.org/p/chromium/issues/detail?id=331236
 * @param {!HTMLElement} element
 * @param {!string} name
 * @param {?string} value
 * @param {?string} priority
 * @return {void}
 */
const setStyleProperty = (element, name, value, priority = '') => {
  element.style.removeProperty(name)
  element.style.setProperty(name, value, priority)
}

// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
// Required by Android API 16 AOSP Nexus S emulator.
// eslint-disable-next-line no-undef
const CustomEvent = typeof window !== 'undefined' && window.CustomEvent
  || function(type, parameters = { bubbles: false, cancelable: false, detail: undefined }) {
    // eslint-disable-next-line no-undef
    const event = document.createEvent('CustomEvent')
    event.initCustomEvent(type, parameters.bubbles, parameters.cancelable, parameters.detail)
    return event
  }

export default { matchesSelector, setStyleProperty, CustomEvent }