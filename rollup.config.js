import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const fs = require('fs')

/**
 * Rollup plug-in bundling CSS from multiple transform files into one file.
 * @param  {callback} options Rollup plug-in options func
 * @return {void}
 */
const cssBundle = (options = {}) => {
  const buffer = []
  return {
    transform(code, id) {
      if (!options.fileSuffixPattern.test(id)) { return }
      const relativeFilePath = id.substring(id.match(options.fileSuffixPattern).index)
      buffer.push(`/* --- CSS from '${relativeFilePath}' --- */ \n\n ${code}`)
      return ''
    },
    onwrite(opts) {
      const output =
        `/* --- Wikimedia Page Library CSS bundle --- */\n\n\n${buffer.join('\n\n\n\n\n')}`
      fs.writeFile(options.destination, output, err => { if (err) { throw err } })
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
    cssBundle({
      // Grab files ending in '/src/transform/<TRANSFORM_NAME>.css'
      fileSuffixPattern: /\/src\/transform.*\.css$/,
      destination: './build/wikimedia-page-library-transform.css'
    }),
    cssBundle({
      // Grab files ending in '/src/override/<TRANSFORM_NAME>.css'
      fileSuffixPattern: /\/src\/override.*\.css$/,
      destination: './build/wikimedia-page-library-override.css'
    }),
    babel({
      plugins: ['external-helpers']
    })
  ],
  watch: {
    exclude: ['.eslintcache', 'build', 'demo']
  }
}