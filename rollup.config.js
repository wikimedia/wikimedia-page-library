import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const cssBundler = require('./rollup.cssBundler.js').cssBundler

export default {
  entry: 'src/index.js',
  dest: pkg.main,
  format: 'umd',
  moduleName: 'pagelib',
  sourceMap: true,
  plugins: [
    cssBundler({
      // Grab files ending in '/src/transform/<TRANSFORM_NAME>.css'
      inputFilesSuffixPattern: /\/src\/transform.*\.css$/,
      outputFile: './build/wikimedia-page-library-transform.css'
    }),
    cssBundler({
      // Grab files ending in '/src/override/<TRANSFORM_NAME>.css'
      inputFilesSuffixPattern: /\/src\/override.*\.css$/,
      outputFile: './build/wikimedia-page-library-override.css'
    }),
    babel({
      plugins: ['external-helpers']
    })
  ],
  watch: {
    exclude: ['.eslintcache', 'build', 'demo']
  }
}