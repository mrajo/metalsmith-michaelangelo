'use strict'

const fs = require('fs')
const match = require('micromatch')
const each = require('async').each
const nunjucks = require('nunjucks')
const debug = require('debug')('metalsmith-michaelangelo')
const getConfig = require('./config')

// initialize Nunjucks rendering engine
const initNunjucks = (metalsmith, options) => {
  const env = nunjucks.configure(metalsmith.path(options.directory), options.env)

  // add custom filters from options to Nunjucks engine
  const filter_names = Object.keys(options.filters)
  if (filter_names.length > 0) {
    for (var i = 0; i < filter_names.length; i++) {
      env.addFilter(filter_names[i], options.filters[filter_names[i]]);
    }
  }

  return env
}

// renders a file through Nunjucks
const getRenderFunction = (files, metalsmith, options, env) => {
  // checks if file should be rendered
  const should_render = (file, options) => {
    return (options.pattern && match(file, options.pattern)[0]) ||
            (options.pattern == null && files[file].hasOwnProperty(options.templateKey) && files[file][options.templateKey] != null)
  }

  return function(file, done) {
    if (should_render(file, options)) {
      debug(`rendering ${file}`)

      let template = null;
      let rendered = null;
      const data = Object.assign({}, metalsmith.metadata(), files[file])

      if (files[file][options.templateKey] === false) {
        // render file content as inline template
        template = files[file].contents.toString()
        rendered = env.renderString(template, data)
      } else {
        // render template file with file contents
        template = metalsmith.path(options.directory, files[file][options.templateKey] || options.default)
        data.contents = files[file].contents.toString()
        rendered = env.render(template, data)
      }

      files[file].contents = new Buffer(rendered)

      done()
    } else {
      debug(`skipped ${file}`)
      done()
    }
  }
}

const plugin = (params) => {
  const options = getConfig(params)

  return function (files, metalsmith, done) {
    const env = initNunjucks(metalsmith, options)
    const render = getRenderFunction(files, metalsmith, options, env)

    // async loop over files and render each
    each(Object.keys(files), render, (err) => {
      // creates a JSON file of config for debugging
      if (options.debug) {
        // convert filters to an array of filter names since functions won't serialize
        options.filters = Object.keys(options.filters)
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
