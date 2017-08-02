import babel from 'rollup-plugin-babel'
import css from 'rollup-plugin-css-porter'
import pkg from './package.json'

const fs = require('fs')

/**
 * Custom rollup plug-in which bundles all transforms' CSS in a single file.
 * @param  {callback} options Rollup plug-in options func
 * @return {void}
 */
const wikimediaPageLibraryTransformCSSRollupPlugin = (options = {}) => {
  const cssBuffer = {}
  return {
    transform(code, id) {
      if (!options.fileSuffixPattern.test(id)) { return }
      if (!Object.prototype.hasOwnProperty.call(cssBuffer, id) || cssBuffer[id] !== code) {
        cssBuffer[id] = code
      }
      return ''
    },
    onwrite(opts) {
      if (!Object.keys(cssBuffer).length) { return }

      const keys = Object.keys(cssBuffer)

      // We want the theme transform to be first. This is because the theme transform CSS has to use
      // some '!important' CSS modifiers to reliably set themes on elements which may contain inline
      // styles. Moving it to the top of the file is necessary so other transforms can override
      // these '!important' themes transform CSS bits if needed.
      const first = 'ThemeTransform.css'
      keys.sort((x,y) => {
        if (x.indexOf(first) > 0) {
          return -1
        } else if (y.indexOf(first) > 0) {
          return 1
        }
        return 0
      })

      const css = keys.map(key => cssBuffer[key]).join('\n\n')
      fs.writeFile(
        options.dest,
        css, err => { if (err) { throw err } }
      )
    }
  }
}

export default {
  entry: 'src/index.js',
  dest: pkg.main,
  format: 'umd',
  moduleName: 'pagelib',
  sourceMap: true,
  plugins: [
    // Deliver all transform CSS as a single file.
    wikimediaPageLibraryTransformCSSRollupPlugin({
      // Only grab files which end in '/src/transform/<TRANSFORM_NAME>.css'
      fileSuffixPattern: /\/src\/transform.*\.css$/,
      dest: './build/wikimedia-page-library-transform.css'
    }),
    css({
      minified: false,
      include: './src/override/**.css',
      dest: './build/wikimedia-page-library-override.css'
    }),
    babel({
      plugins: ['external-helpers']
    })
  ],
  watch: {
    exclude: ['.eslintcache', 'build', 'demo']
  }
}