'use strict'

const each = require('async').each
const debug = require('debug')('metalsmith-michaelangelo')
const getConfig = require('./config')
const nunjucks = require('./renderer')

const plugin = (params) => {
  const options = getConfig(params)

  return (files, metalsmith, done) => {
    const env = nunjucks.init(metalsmith, options)
    const render = nunjucks.getRenderer(files, metalsmith, options, env)

    each(Object.keys(files), render, (err) => {
      // creates a JSON file of config for debugging
      if (options.debug) {
        // convert filters to an array of filter names since functions won't serialize
        options.filters = Object.keys(options.filters)
        debug(`creating debug file`)
        files['debug.json'] = {
          contents: Buffer.from(JSON.stringify(options))
        }
      }
      done()
    })
  }
}

module.exports = plugin
