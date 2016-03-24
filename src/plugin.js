'use strict'

const fs = require('fs')
const match = require('micromatch')
const each = require('async').each
const nunjucks = require('nunjucks')
const debug = require('debug')('metalsmith-michaelangelo')

const plugin = (params) => {
  const defaults = {
    directory: 'templates',
    templateKey: 'template',
    default: 'default.html',
    pattern: null,
    filters: {},
    debug: false
  }
  const options = Object.assign(defaults, params)

  return function (files, metalsmith, done) {
    // initialize Nunjucks rendering engine
    const env = nunjucks.configure(metalsmith.path(options.directory))

    // add custom filters from options to Nunjucks engine
    const filter_names = Object.keys(options.filters)
    if (filter_names.length > 0) {
      for (var i = 0; i < filter_names.length; i++) {
        env.addFilter(filter_names[i], options.filters[filter_names[i]]);
      }
    }

    // checks if file should be rendered
    const should_render = (file) => {
      return (options.pattern && match(file, options.pattern)[0]) ||
             (options.pattern == null && files[file].hasOwnProperty(options.templateKey) && files[file][options.templateKey] != null)
    }

    // renders a file through Nunjucks
    const render = (file, done) => {
      if (should_render(file)) {
        debug(`rendering ${file}`)
        const template = metalsmith.path(options.directory, files[file][options.templateKey] || options.default)
        const data = Object.assign({}, metalsmith.metadata(), files[file])
        data.contents = files[file].contents.toString()
        const rendered = env.render(template, data)
        files[file].contents = new Buffer(rendered)
        done()
      } else {
        debug(`skipped ${file}`)
        done()
      }
    }

    // async loop over files and render each
    each(Object.keys(files), render, (err) => {
      // creates a JSON file of config for debugging
      if (options.debug) {
        debug(`creating debug file`)
        files['debug.json'] = {
          contents: new Buffer(JSON.stringify(options))
        }
      }
      done()
    })
  }
}

module.exports = plugin