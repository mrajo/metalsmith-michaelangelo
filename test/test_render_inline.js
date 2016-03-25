'use strict'

const test = require('tape')
const Metalsmith = require('metalsmith')
const render = require('../src/plugin')
const assert = require('./libassert')
const path = require('path')
const fs = require('fs-extra')

test('render: should render inline templates', (t) => {
  var src = 'test/fixtures/render-inline';

  Metalsmith(src)
    .use(render({
      pattern: '*.html'
    }))
    .build(assert.dirsEqual(t, src));
})