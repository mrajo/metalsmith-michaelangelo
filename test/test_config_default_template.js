'use strict'

const test = require('tape')
const Metalsmith = require('metalsmith')
const render = require('../src/plugin')
const assert = require('./libassert')
const path = require('path')
const fs = require('fs-extra')

test('config: should override default template', (t) => {
  var src = 'test/fixtures/config-default-template'
  fs.ensureDirSync(path.join(src, 'src'))

  Metalsmith(src)
    .use(render({
      default: 'main.tpl',
      debug: true
    }))
    .build(assert.filesEqual(t, src, 'debug.json'))
})