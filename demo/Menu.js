/* eslint-disable require-jsdoc */

import DemoArticles from './lib/DemoArticles.js'
import DemoControls from './lib/DemoControls.js'
import util from './lib/util.js'
const { handleKeyPress, removeAllIframePreviews } = util

const DEMO_ARTICLES_INDEX_PATH = './DemoArticles/articles.json'

const ClosuresManager = {
  activeTransformApplicationClosures: {},
  addTransformApplicationClosure(id, transformApplicationClosure) {
    ClosuresManager.activeTransformApplicationClosures[id] = transformApplicationClosure
  },
  rmTransformApplicationClosure(id) {
    if (id in ClosuresManager.activeTransformApplicationClosures) {
      delete ClosuresManager.activeTransformApplicationClosures[id]
    }
  },
}

/**
 * All Transforms Demo controls
 * @type {!DemoControls}
 */
const Controls = DemoControls(ClosuresManager)
/**
 * All Transforms Demo Articles Utilities
 * @type {!DemoArticles}
 */
const Articles = DemoArticles(ClosuresManager)

/**
 * Attaches anchor elements to the menu.
 * @param {!Array<HTMLAnchorElement>} anchors
 * @return {void}
 */
const addAnchorsToMenu = anchors => {
  const themeDemoMenu = document.getElementById('theme_demo_menu')
  anchors.forEach(anchor => themeDemoMenu.appendChild(anchor))
}

const removeAllAnchorsFromMenu = () => {
  document.getElementById('theme_demo_menu').innerHTML = ''
}

fetch(DEMO_ARTICLES_INDEX_PATH)
  .then(response => response.json())
  .then(Articles.articleRefsFromArticlesJSON)
  .then(articleRefs => [Articles.articleSelectOptionsFromArticleRefs(articleRefs), articleRefs])
  .then(([options, articleRefs]) => {
    Articles.addArticleOptionsToSelect(options, Articles.articleSelectElement)
    return articleRefs
  }).then(articleRefs => {
    Articles.articleSelectElement.addEventListener('change', event => {
      if (!event) {
        return
      }

      const selectedArticleRefs = Articles.articleRefsForSelectedArticleOptions(
        event.target, articleRefs
      )

      removeAllIframePreviews()
      Articles.addIframePreviewsForArticleRefs(selectedArticleRefs)

      removeAllAnchorsFromMenu()
      addAnchorsToMenu(Articles.anchorsFromArticleRefs(selectedArticleRefs))

    }, true)
  }).then(() => {
    // Add transformation controls to menu
    Controls.addControls()

    // Handle keypress
    window.addEventListener('keypress', event => {
      handleKeyPress(event.keyCode)
    }, false)

    // Handle keypress from iFrames
    window.addEventListener('message', event => {
      handleKeyPress(event.data)
    }, false)
  })
