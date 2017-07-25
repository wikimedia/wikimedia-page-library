// http://www.browsersync.io/docs/options/
module.exports = {
  files: ['build/*.{css,js}', 'demo/*.{html,css,js,json}'],
  server: {
    baseDir: 'demo',
    directory: true
  }
}