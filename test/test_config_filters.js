'use strict'

const test = require('tape')
const Metalsmith = require('metalsmith')
const render = require('../src/plugin')
const assert = require('./libassert')
const path = require('path')
const fs = require('fs-extra')

test('config: should override filters', (t) => {
  var src = 'test/fixtures/config-filters'

  Metalsmith(src)
    .use(render({
      filters: {
        foo: _ => 'foo'
      },
      debug: true
    }))
    .build(assert.jsonEqual(t, src, 'debug.json'))
})
