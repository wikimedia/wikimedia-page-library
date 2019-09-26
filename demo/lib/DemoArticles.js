/* eslint-disable require-jsdoc */

import util from './util.js'
const { expandIframeHeight } = util

/* global ArticleRef, ArticleRefSourceType, flattenArrayOfArrays */

let ClosureManager

/**
 * Converts article JSON to ArticleRefs.
 * @param {!Array<Object>} json array of article JSON objects
 * @return {!Array<ArticleRef>}
 */
const articleRefsFromArticlesJSON = json => flattenArrayOfArrays(
  json.map(articleData => [
    new ArticleRef(
      articleData.lang,
      articleData.title,
      articleData.revision,
      ArticleRefSourceType.mobileView
    ),
    new ArticleRef(
      articleData.lang,
      articleData.title,
      articleData.revision,
      ArticleRefSourceType.mobileContentService
    ),
    new ArticleRef(
      articleData.lang,
      articleData.title,
      articleData.revision,
      ArticleRefSourceType.pageContentService
    )
  ])
)

/**
 * Converts ArticleRefs to anchor elements.
 * @param {!Array<ArticleRef>} articleRefs
 * @return {!Array<HTMLAnchorElement>}
 */
const anchorsFromArticleRefs = articleRefs => articleRefs.map(articleRef => {
  const anchor = document.createElement('a')
  anchor.href = `#${articleRef.fileName()}`
  anchor.innerHTML = articleRef.displayName()
  return anchor
})

const titleDivForArticleRef = articleRef => {
  const div = document.createElement('div')
  div.innerHTML = articleRef.displayName()
  div.classList.add('theme_demo_article_title')
  div.id = articleRef.fileName()
  div.title = articleRef.displayName()
  return div
}

const articleSelectOptionsFromArticleRefs = articleRefs => articleRefs.map(articleRef => {
  const option = document.createElement('option')
  option.value = articleRef.fileName()
  option.innerHTML = articleRef.displayName()
  return option
})

const addArticleOptionsToSelect = (options, select) => {
  select.size = options.length
  options.forEach(anchor => select.appendChild(anchor))
}

const reapplyActiveTransformsToIframe = iframe => {
  const apply = ([id, transformClosure]) => transformClosure(iframe)
  Object.entries(ClosureManager.activeTransformApplicationClosures).forEach(apply)
}

const addHTMLToDocument = (html, articleRef) => {
  const iframe = document.createElement('iframe')
  iframe.scrolling = 'no'
  iframe.classList.add('article_preview')
  const titleDiv = titleDivForArticleRef(articleRef)
  document.body.appendChild(titleDiv)

  iframe.addEventListener('load', event => {
    expandIframeHeight(event.target)

    // Once the pagelib is attached to the iframe content window it's safe to apply previously
    // selected transforms
    if (iframe.contentWindow.pagelib) {
      reapplyActiveTransformsToIframe(iframe)
    }

  }, true)

  document.body.appendChild(iframe)

  // FIXME: i think this was so iframe would resize itself if its doc height changed, but it's not
  // working. should it be on `iframe.contentWindow` - that doesn't seem to work either...
  // to repro expand and collapse tables and check if bottom of article is clipped
  window.addEventListener('resize', () => expandIframeHeight(iframe), true)

  const iframeDocument = iframe.contentWindow.document

  // Park the ArticleRef here for easy access later. For example, provides easy way to check if a
  // document is showing content for a particular ArticleRef sourceType. This is handy in case a
  // particular transform demo should be applied to, say, mobileview content, but not MCS content.
  iframeDocument.articleRef = articleRef

  iframeDocument.open()
  iframeDocument.write(html)
  iframeDocument.close()

  const htmlElement = iframeDocument.documentElement
  htmlElement.setAttribute('dir', articleRef.isRTL() ? 'rtl' : 'ltr')

  // Relay iframe keypress to the parent window.
  iframeDocument.addEventListener('keypress', event => {
    window.postMessage(event.keyCode)
  }, false)
}

/**
 * Promises for fetching article section JSON arrays from local data files for ArticleRefs.
 * @param {!Array<ArticleRef>} articleRefs
 * @return {!Array<Promise>}
 */
const fetchArticlesHTMLForArticleRefs = articleRefs =>
  articleRefs.map(articleRef => articleRef.fetchCompleteHTML())

const addIframePreviewsForArticleRefs = articleRefs => {
  Promise.all(fetchArticlesHTMLForArticleRefs(articleRefs))
    .then(articlesHTML => {
      articlesHTML.forEach((articleHTML, i) => addHTMLToDocument(articleHTML, articleRefs[i]))
    })
}

const selectedValuesFromSelect = select => {
  const selectedOptions = Array.apply(null, select.options).filter(option => option.selected)
  return selectedOptions.map(option => option.value)
}

const articleSelectElement = document.getElementById('theme_demo_article_select')

const articleRefsForSelectedArticleOptions =
  (selectElement, articleRefs) => articleRefs.filter(
    articleRef => selectedValuesFromSelect(selectElement).includes(articleRef.fileName())
  )

export default function(manager) {
  ClosureManager = manager
  return {
    articleRefsForSelectedArticleOptions,
    articleRefsFromArticlesJSON,
    articleSelectOptionsFromArticleRefs,
    addArticleOptionsToSelect,
    articleSelectElement,
    addIframePreviewsForArticleRefs,
    anchorsFromArticleRefs,
  }
}
