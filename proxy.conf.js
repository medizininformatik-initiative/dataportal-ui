// ng serve loads this file, which also starts the playground tab helper (dev only, see scripts/playground-tabs.cjs)
require('./scripts/playground-tabs.cjs').start()

module.exports = {
  '/api': {
    target: 'http://localhost:8090',
    pathRewrite: {
      '^/api': '',
    },
  },
  '/aqleditor': {
    target: 'http://localhost:8091',
  },
  '/playground-api': {
    target: 'http://127.0.0.1:4301',
    pathRewrite: {
      '^/playground-api': '',
    },
  },
}
