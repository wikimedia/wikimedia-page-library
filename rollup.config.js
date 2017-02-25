import babel from 'rollup-plugin-babel'
const pkg = require('./package.json')

export default {
  entry: 'src/index.js',
  dest: pkg.main,
  format: 'cjs',
  sourceMap: true,
  plugins: babel()
}