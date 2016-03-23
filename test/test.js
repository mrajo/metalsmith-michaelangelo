'use strict';

var assert = require('assert');
var dir_equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var render = require('../src/plugin');
 var join = require('path').join;
// var read = require('fs').readFileSync;
// var buffer_equal = require('buffer-equal');
// var utf8 = require('is-utf8');

function assertDirsEqual(src, done) {
  return function (err) {
    if (err) return done(err);
    dir_equal(join(src, 'expected'), join(src, 'build'));
    done();
  };
}

describe('metalsmith-michaelangelo', function () {
  it('should use default configuration', function (done) {
    var src = 'test/fixtures/defaults';

    Metalsmith(src)
      .use(render())
      .build(assertDirsEqual(src, done));
  });
});