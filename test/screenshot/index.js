/**
 * @typedef {object} Viewport
 * @prop {!number} width
 * @prop {!number} height
 */

/** @type {!Viewport[]} */
const viewports = [{ width: 160, height: 144 }, { width: 320, height: 240 },
  { width: 480, height: 320 }]

/**
 * @param {!Gemini.Suite} suite
 * @param {!string} filename A portion of hte stem
 * @param {?Gemini.Callback} callback Invoked after to each viewport capture
 * @return {void}
 */
const captureViewports = (suite, filename, callback) =>
  viewports.forEach(viewport =>
    suite.capture(`${filename}-${viewport.width}x${viewport.height}`, (actions, find) => {
      actions.setWindowSize(viewport.width, viewport.height)
      if (callback) { callback(actions, find) }
    }))

// https://github.com/gemini-testing/gemini/blob/master/doc/tests.md
// https://github.com/gemini-testing/gemini/blob/master/doc/config.md
// fake RTL via mediawiki usercss "direction:rtl;" in url

gemini.suite('CollapseTableTransformer-minerva-en', suite => {
  suite
    .setUrl('/w/index.php?oldid=745942135')
    .setCaptureElements('.mf-section-3')
    .capture('plain')
    .capture('with text', actions => actions.click('#References'))

  // captureViewports(suite, 'expanded')
  // suite.capture('plain2')
  // captureViewports(suite, 'collapsed', actions => actions.click('#References'))
})

gemini.suite('CollapseTableTransformer-restbase-en', suite => {
  suite
    .setUrl('/api/rest_v1/page/html/Picasso\'s_Blue_Period/745942135')
    .setCaptureElements('#References, #References + ul')
    .capture('plain')
    .capture('with text', actions => actions.click('#References'))

  // captureViewports(suite, 'collapse')
})