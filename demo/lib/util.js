/* eslint-disable require-jsdoc */

const expandIframeHeight = iframe => {
  iframe.style.height = `${iframe.contentWindow.document.body.offsetHeight}px`
}

const removeAllIframePreviews = () => {
  const removeElement = iframe => iframe.parentNode.removeChild(iframe)
  document.querySelectorAll('iframe.article_preview, div.theme_demo_article_title')
    .forEach(removeElement)
}

const isElementOnscreen = element => {
  const rect = element.getBoundingClientRect()
  const docHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
  return !(rect.bottom < 0 || rect.top - docHeight >= 0)
}

// Looks at which article preview iFrames are currently onscreen and gets the next or previous one
// according to `direction`.
const nextOrPreviousIframe = direction => {
  const iframes = Array.from(document.querySelectorAll('iframe'))
  const onscreenIframes = iframes.filter(isElementOnscreen)
  if (onscreenIframes.length === 0) {
    return null
  }
  let i = iframes.indexOf(onscreenIframes[onscreenIframes.length - 1]) + direction
  if (i > iframes.length - 1) {
    i = 0
  }
  if (i < 0) {
    i = iframes.length - 1
  }
  return iframes[i]
}

// ',' and '.' keys are used to jump between article previews
const handleKeyPress = keyCode => {
  if (keyCode !== 44 && keyCode !== 46) {
    return
  }
  const direction = keyCode === 44 ? -1 : 1
  const iframeToJumpTo = nextOrPreviousIframe(direction)
  if (iframeToJumpTo === null) {
    return
  }
  document.location.href = `#${iframeToJumpTo.contentDocument.articleRef.fileName()}`
}

export default {
  expandIframeHeight,
  handleKeyPress,
  removeAllIframePreviews,
}
