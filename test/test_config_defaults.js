'use strict'

const test = require('tape')
const Metalsmith = require('metalsmith')
const render = require('../src/plugin')
const assert = require('./libassert')
const path = require('path')
const fs = require('fs-extra')

test('config: should have default config', (t) => {
  var src = 'test/fixtures/config-defaults'
  fs.ensureDirSync(path.join(src, 'src'))

  Metalsmith(src)
    .use(render({
      debug: true
    }))
    .build(assert.jsonEqual(t, src, 'debug.json'))
})
