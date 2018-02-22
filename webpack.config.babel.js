import * as path from 'path'
import * as pkg from './package.json'
import * as webpack from 'webpack'
import CleanPlugin from 'clean-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const PRODUCTION = process.env.NODE_ENV === 'production'

const STATS = {
  all: false,
  errors: true,
  errorDetails: true,
  moduleTrace: true,
  warnings: true
}

const config = {
  entry: {
    'wikimedia-page-library-transform': './src/transform',
    'wikimedia-page-library-override': './src/override'
  },

  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    library: 'pagelib',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },

  performance: {
    hints: PRODUCTION ? 'error' : false,
    maxAssetSize: 128 * 1024,
    maxEntrypointSize: 192 * 1024
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            compact: PRODUCTION,
            comments: !PRODUCTION
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: { hmr: false }
          },
          use: [{ loader: 'css-loader' }, 'postcss-loader']
        })
      }
    ]
  },

  stats: STATS,

  devtool: PRODUCTION ? 'source-map' : 'cheap-module-eval-source-map',

  devServer: PRODUCTION ? undefined : {
    clientLogLevel: 'warning',
    progress: false,
    overlay: { warnings: true, errors: true },
    stats: STATS
  },

  plugins: [
    new CleanPlugin('build', { verbose: false }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(PRODUCTION ? 'production' : 'development')
      },
      VERSION: JSON.stringify(pkg.version)
    }),
    new ExtractTextPlugin({ filename: '[name].css' })
  ]
}

export default config