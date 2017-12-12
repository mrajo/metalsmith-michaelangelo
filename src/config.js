'use strict'

module.exports = function (params) {
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
