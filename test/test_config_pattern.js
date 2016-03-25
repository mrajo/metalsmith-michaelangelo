'use strict'

const test = require('tape')
const Metalsmith = require('metalsmith')
const render = require('../src/plugin')
const assert = require('./libassert')
const path = require('path')
const fs = require('fs-extra')

test('config: should override pattern', (t) => {
  var src = 'test/fixtures/config-pattern'
  fs.ensureDirSync(path.join(src, 'src'))

  Metalsmith(src)
    .use(render({
      pattern: '*.html',
      debug: true
    }))
    .build(assert.filesEqual(t, src, 'debug.json'))
})