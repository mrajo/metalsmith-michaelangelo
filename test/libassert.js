'use strict'

const path = require('path')
const fs = require('fs-extra')
const buffer_equal = require('buffer-equal')
const utf8 = require('is-utf8')
const readdir = require('fs-readdir-recursive')

// @t tape test object
// @src Metalsmith source folder
// assertions return a function to be used in Metalsmith.build() callback
module.exports = {
  // @file filename relative to @src to compare
  filesEqual: (t, src, file) => {
    return (err) => {
      if (err) t.fail(`Metalsmith build failed: ${err.toString()}`)

      const file_a = fs.readFileSync(path.join(src, 'build', file))
      const file_e = fs.readFileSync(path.join(src, 'expected', file))

      if (utf8(file_a) && utf8(file_e)) {
        t.equal(file_a.toString(), file_e.toString(), `${file} is identical`)
      } else {
        t.ok(buffer_equal(file_a, file_e), `${file} is identical`)
      }

      t.end()
    }
  },
  dirsEqual: (t, src) => {
    return (err) => {
      if (err) t.fail(`Metalsmith build failed: ${err.toString()}`)

      const path_actual   = path.join(src, 'build')
      const path_expected = path.join(src, 'expected')
      const dir_actual    = readdir(path.join(src, 'build'))
      const dir_expected  = readdir(path.join(src, 'expected'))

      t.deepEqual(dir_actual, dir_expected, 'actual and expected dir trees are equal')

      dir_actual.forEach((file) => {
        const file_a = fs.readFileSync(path.resolve(path_actual, file))
        const file_e = fs.readFileSync(path.resolve(path_expected, file))

        if (utf8(file_a) && utf8(file_e)) {
          t.equal(file_a.toString(), file_e.toString(), `${file} is identical`)
        } else {
          t.ok(buffer_equal(file_a, file_e), `${file} is identical`)
        }
      })

      t.end()
    }
  }
}