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
  const buffer = {}
  return {
    transform(code, id) {
      if (!options.inputFilesSuffixPattern.test(id)) { return }
      if (!Object.prototype.hasOwnProperty.call(buffer, id) || buffer[id] !== code) {
        const relativeFilePath = id.substring(id.match(options.inputFilesSuffixPattern).index)
        buffer[id] = `/* --- CSS from '${relativeFilePath}' --- */ \n\n ${code}`
      }
      return ''
    },
    onwrite(opts) {
      const css = Object.keys(buffer).map(key => buffer[key]).join('\n\n\n\n\n')
      const output =
        `/* --- Wikimedia Page Library CSS bundle --- */\n\n\n${css}`
      fs.writeFile(options.outputFile, output, err => { if (err) { throw err } })
    }
  }
}

module.exports = {
  cssBundler
}