'use strict'

const test = require('tape')
const Metalsmith = require('metalsmith')
const render = require('../src/plugin')
const assert = require('./libassert')
const path = require('path')
const fs = require('fs-extra')

test('config: should override template key', (t) => {
  var src = 'test/fixtures/config-templatekey'
  fs.ensureDirSync(path.join(src, 'src'))

  Metalsmith(src)
    .use(render({
      templateKey: 'layout',
      debug: true
    }))
    .build(assert.filesEqual(t, src, 'debug.json'))
})