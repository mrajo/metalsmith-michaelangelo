'use strict';

var assert = require('assert');
var dir_equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var render = require('../src/plugin');
var path = require('path');
var fs = require('fs-extra');
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
    fs.ensureDirSync(path.join(src, 'src'));

    Metalsmith(src)
      .use(render({
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should override debug and create a debug output file', function (done) {
    var src = 'test/fixtures/config-debug';
    fs.ensureDirSync(path.join(src, 'src'));

    Metalsmith(src)
      .use(render({
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should override directory', function (done) {
    var src = 'test/fixtures/config-directory';
    fs.ensureDirSync(path.join(src, 'src'));

    Metalsmith(src)
      .use(render({
        directory: 'layouts',
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should override templateKey', function (done) {
    var src = 'test/fixtures/config-templatekey';
    fs.ensureDirSync(path.join(src, 'src'));

    Metalsmith(src)
      .use(render({
        templateKey: 'layout',
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should override default template', function (done) {
    var src = 'test/fixtures/config-default-template';
    fs.ensureDirSync(path.join(src, 'src'));

    Metalsmith(src)
      .use(render({
        default: 'main.tpl',
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should override pattern', function (done) {
    var src = 'test/fixtures/config-pattern';
    fs.ensureDirSync(path.join(src, 'src'));

    Metalsmith(src)
      .use(render({
        pattern: '*.html',
        debug: true
      }))
      .build(assertFilesEqual(src, 'debug.json', done));
  });

  it('should use custom filters', function (done) {
    var src = 'test/fixtures/config-filters';

    Metalsmith(src)
      .use(render({
        filters: {
          rot13: function (data) {
            if (typeof data == 'string') {
              return data.replace(/[a-zA-Z]/g, (c) => {
                return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
              })
            }
            return data
          }
        }
      }))
      .build(assertDirsEqual(src, done));
  });
});

describe('rendering', function () {
  it('should render with defaults', function (done) {
    var src = 'test/fixtures/render-defaults';

    Metalsmith(src)
      .use(render())
      .build(assertDirsEqual(src, done));
  });

  it('should render by pattern with default template', function (done) {
    var src = 'test/fixtures/render-pattern';

    Metalsmith(src)
      .use(render({
        pattern: '*.html'
      }))
      .build(assertDirsEqual(src, done));
  });

  it('should render inline templates', function (done) {
    var src = 'test/fixtures/render-inline';

    Metalsmith(src)
      .use(render({
        pattern: '*.html'
      }))
      .build(assertDirsEqual(src, done));
  });

  it('should render with every option overridden', function (done) {
    var src = 'test/fixtures/render-no-defaults';

    Metalsmith(src)
      .use(render({
        directory: 'layouts',
        templateKey: 'layout',
        default: 'main.html',
        pattern: '*.html',
        filters: {
          rot13: function (data) {
            if (typeof data == 'string') {
              return data.replace(/[a-zA-Z]/g, (c) => {
                return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
              })
            }
            return data
          }
        },
        debug: true
      }))
      .build(assertDirsEqual(src, done));
  });
});