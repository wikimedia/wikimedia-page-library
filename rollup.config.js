import babel from 'rollup-plugin-babel'
import css from 'rollup-plugin-css-porter'
import pkg from './package.json'

export default {
  entry: 'src/index.js',
  dest: pkg.main,
  format: 'umd',
  moduleName: 'pagelib',
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