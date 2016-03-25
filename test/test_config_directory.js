'use strict'

const test = require('tape')
const Metalsmith = require('metalsmith')
const render = require('../src/plugin')
const assert = require('./libassert')
const path = require('path')
const fs = require('fs-extra')

test('config: should override directory', (t) => {
  var src = 'test/fixtures/config-directory'
  fs.ensureDirSync(path.join(src, 'src'))

  Metalsmith(src)
    .use(render({
      directory: 'layouts',
      debug: true
    }))
    .build(assert.filesEqual(t, src, 'debug.json'))
})