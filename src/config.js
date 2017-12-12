'use strict'

const setConfig = (params) => {
  const defaults = {
    directory: 'templates',
    templateKey: 'template',
    default: 'default.html',
    pattern: null,
    filters: {},
    debug: false,
    env: {}
  }
  return Object.assign(defaults, params)
}

module.exports = setConfig
