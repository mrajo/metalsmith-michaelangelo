'use strict'

const match = require('micromatch')
const nunjucks = require('nunjucks')
const debug = require('debug')('metalsmith-michaelangelo')

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

// returns a function to render a file through Nunjucks with Metalsmith API
const getRenderFunction = (files, metalsmith, options, env) => {
  // checks if file should be rendered
  const should_render = (file, options) => {
    return (options.pattern && match(file, options.pattern)[0]) ||
      (options.pattern == null && files[file].hasOwnProperty(options.templateKey) && files[file][options.templateKey] != null)
  }

  return (file, done) => {
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

      files[file].contents = Buffer.from(rendered)

      done()
    } else {
      debug(`skipped ${file}`)
      done()
    }
  }
}

module.exports = {
  init: initNunjucks,
  getRenderer: getRenderFunction
}
