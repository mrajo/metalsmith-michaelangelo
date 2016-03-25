'use strict'

const test = require('tape')
const Metalsmith = require('metalsmith')
const render = require('../src/plugin')
const assert = require('./libassert')
const path = require('path')
const fs = require('fs-extra')

test('render: should render with defaults', (t) => {
  var src = 'test/fixtures/render-defaults'
  fs.ensureDirSync(path.join(src, 'src'))

  Metalsmith(src)
    .use(render())
    .build(assert.dirsEqual(t, src))
})