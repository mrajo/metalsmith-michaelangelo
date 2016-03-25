'use strict'

const test = require('tape')
const Metalsmith = require('metalsmith')
const render = require('../src/plugin')
const assert = require('./libassert')
const path = require('path')
const fs = require('fs-extra')

test('render: should render with all options overridden', (t) => {
  var src = 'test/fixtures/render-no-defaults'

  Metalsmith(src)
    .use(render({
      directory: 'layouts',
      templateKey: 'layout',
      default: 'main.html',
      pattern: '*.html',
      filters: {
        rot13: (data) => {
          if (typeof data == 'string') {
            return data.replace(/[a-zA-Z]/g, (c) => {
              return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
            })
          }
          return data
        }
      },
      debug: true
    }))
    .build(assert.dirsEqual(t, src))
})