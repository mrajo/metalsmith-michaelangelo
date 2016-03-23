'use strict';

var assert = require('assert');
var dir_equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var render = require('../src/plugin');
var path = require('path');
var fs = require('fs');
var buffer_equal = require('buffer-equal');
var utf8 = require('is-utf8');

function assertDirsEqual(src, done) {
  return function (err) {
    if (err) return done(err);
    dir_equal(path.join(src, 'expected'), path.join(src, 'build'));
    done();
  };
}

function assertFilesEqual(src, file, done) {
  return function (err) {
    var file_a = fs.readFileSync(path.join(src, 'expected', file));
    var file_b = fs.readFileSync(path.join(src, 'build', file));

    if (utf8(file_a) && utf8(file_b)) {
      assert.equal(file_a.toString(), file_b.toString());
    } else {
      assert(buffer_equal(file_a, file_b));
    }

    done();
  };
}

describe('configuration', function () {
  it('should use default configuration', function (done) {
    var src = 'test/fixtures/config-defaults';

    Metalsmith(src)
      .use(render())
      .build(assertDirsEqual(src, done));
  });

  it('should override debug and create a debug output file', function (done) {
    var src = 'test/fixtures/config-debug';

    Metalsmith(src)
      .use(render({
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should override directory', function (done) {
    var src = 'test/fixtures/config-directory';

    Metalsmith(src)
      .use(render({
        directory: 'layouts',
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should override templateKey', function (done) {
    var src = 'test/fixtures/config-templatekey';

    Metalsmith(src)
      .use(render({
        templateKey: 'layout',
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should override default template', function (done) {
    var src = 'test/fixtures/config-default-template';

    Metalsmith(src)
      .use(render({
        default: 'main.tpl',
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should override pattern', function (done) {
    var src = 'test/fixtures/config-pattern';

    Metalsmith(src)
      .use(render({
        pattern: '*.html',
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should add filters');
});