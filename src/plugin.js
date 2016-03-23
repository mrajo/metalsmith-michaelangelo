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
    pattern: '**/*.html',
    filters: {},
    debug: false
  }
  const options = Object.assign(defaults, params)

  return function (files, metalsmith, done) {
    const env = nunjucks.configure(metalsmith.path(options.directory))

    env.addFilter('rot13', (data) => {
      if (typeof data == 'string') {
        return data.replace(/[a-zA-Z]/g, (c) => {
          return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
        })
      }
      return data
    });

    const should_render = (file) => {
      return (options.pattern && match(file, options.pattern)[0]) ||
             (options.pattern == null && files[file].hasOwnProperty(options.templateKey) && files[file][options.templateKey] != null)
    }

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

    each(Object.keys(files), render, (err) => {
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