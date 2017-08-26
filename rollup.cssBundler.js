const fs = require('fs')

/**
 * @typedef RollupPluginOptions
 * @type {!object}
 * @property {!string} inputFilesSuffixPattern
 * @property {!string} outputFile
 */

/**
 * Custom rollup plug-in bundling CSS from multiple transform files into one file. Also adds
 * comments to respective sections for quick reminders where each chunck of CSS comes from.
 * Based on https://www.npmjs.com/package/rollup-plugin-css-porter
 * @param  {!RollupPluginOptions} options Rollup plug-in options
 * @return {void}
 */
const cssBundler = (options = {}) => {

  /**
   * Checks if the path is for a file we are interested in.
   * @param  {!string} path
   * @return {!boolean}
   */
  const pathHasRequiredSuffix = path => options.inputFilesSuffixPattern.test(path)

  /**
   * Gets portion of file path defined by inputFilesSuffixPattern.
   * @param  {!string} path
   * @return {!string}
   */
  const relativePath = path => path.substring(path.match(options.inputFilesSuffixPattern).index)

  // Buffer for accumulating CSS from files.
  const buffer = {}

  /**
   * Checks if CSS has already been added to buffer.
   * Needed because of some oddity in the way rollup plugins are passed strings. They appear to 
   * add strings multiple times without this. Unsure why.
   * @param  {!string} css
   * @param  {!string} key
   * @return {!boolean}
   */
  const bufferNeedsCSSForKey =
    (css, key) => Boolean(!Object.prototype.hasOwnProperty.call(buffer, key) || buffer[key] !== css)

  /**
   * Gets all accumulated CSS from the buffer.
   * @return {!string}
   */
  const allBufferCSS = () => Object.keys(buffer).map(key => buffer[key]).join('\n\n\n\n\n')

  return {
    transform(css, path) {
      if (!pathHasRequiredSuffix(path)) { return }
      const key = relativePath(path)
      if (bufferNeedsCSSForKey(css, key)) {
        buffer[key] = `/* --- CSS from '${key}' --- */ \n\n ${css}`
      }
      return ''
    },
    onwrite(opts) {
      fs.writeFile(
        options.outputFile,
        `/* --- Wikimedia Page Library CSS bundle --- */\n\n\n${allBufferCSS()}`,
        err => { if (err) { throw err } }
      )
    }
  }
}

module.exports = {
  cssBundler
}