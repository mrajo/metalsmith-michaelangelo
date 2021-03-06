'use strict'

const test = require('tape')
const Metalsmith = require('metalsmith')
const render = require('../src/plugin')
const assert = require('./libassert')
const path = require('path')
const fs = require('fs-extra')

test('config: should pass Nunjucks config to Nunjucks env object', (t) => {
  var src = 'test/fixtures/config-env'
  fs.ensureDirSync(path.join(src, 'src'))

  Metalsmith(src)
    .use(render({
      debug: true,
      env: {
        autoescape: false,
        trimBlocks: true,
        tags: {
          blockStart: '<%',
          blockEnd: '%>',
          variableStart: '<$',
          variableEnd: '$>',
          commentStart: '<#',
          commentEnd: '#>'
        }
      }
    }))
    .build(assert.jsonEqual(t, src, 'debug.json'))
})