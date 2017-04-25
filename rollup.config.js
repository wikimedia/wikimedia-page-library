import babel from 'rollup-plugin-babel'
const pkg = require('./package.json')
import css from 'rollup-plugin-css-porter'

export default {
  entry: 'src/index.js',
  dest: pkg.main,
  format: 'cjs',
  sourceMap: true,
  plugins: [
    css({
      minified: false,
      include: 'src/transform/**.css'
    }),
    css({
      minified: false,
      include: 'src/override/**.css',
      dest: 'build/wikimedia-page-library-override.css'
    }),
    babel()
  ]
}