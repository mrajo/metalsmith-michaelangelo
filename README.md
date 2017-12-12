# metalsmith-michaelangelo [![Build Status](https://travis-ci.org/mrajo/metalsmith-michaelangelo.svg?branch=master)](https://travis-ci.org/mrajo/metalsmith-michaelangelo) [![Maintainability](https://api.codeclimate.com/v1/badges/de1fc8b092ef81484d3b/maintainability)](https://codeclimate.com/github/mrajo/metalsmith-michaelangelo/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/de1fc8b092ef81484d3b/test_coverage)](https://codeclimate.com/github/mrajo/metalsmith-michaelangelo/test_coverage)

> A Metalsmith plugin for rendering Nunjucks templates

This plugin renders files through Nunjucks templates. The primary goal is to
allow custom filters to be passed into the plugin.

## Install

```
npm install github:mrajo/metalsmith-michaelangelo
```

## Usage

```javascript
var Metalsmith = require('metalsmith');
var render = require('metalsmith-michaelangelo');

Metalsmith(__dirname)
    .use(render({
      // config
    }))
    .build();
```

The plugin accepts a configuration object as its only argument.

### directory
Type: `string`
Default: `templates`

Defines a directory relative to the Metalsmith working directory to look for
Nunjuck templates.

### templateKey
Type: `string`
Default: `layout`

Defines a key in a Metalsmith file's front matter to be used to specify which
template in `options.directory` to render. If this key is set to `false`, then
the file's contents will be rendered as an inline template.

### default
Type: `string`
Default: `default.html`

Defines a default template to use if the file being rendered doesn't specify a
template in its front matter with `options.templateKey`.

### pattern
Type: `string`
Default: `null`

By default (when pattern is `null`), only files with `options.templateKey`
defined in front matter will be rendered. This can be overridden with a glob
pattern (handled by [micromatch](https://github.com/jonschlinkert/micromatch))
to determine which files to render. If a glob pattern is given, the default
template defined in `options.default` will be used when no template is set in
front matter.

### filters
Type: `object`
Default: `{}`

Defines a collection of custom filters to add to the Nunjucks Environment. The
object key will serve as the filter name and the value will be the function
implementing the filter. Refer to [Nunjucks docs](http://mozilla.github.io/nunjucks/api.html#custom-filters)
for more information.

### env
Type: `object`
Default: `{}`

Defines a collection of to pass to the Environment instance in Nunjucks. Refer to
[Nunjucks docs](https://mozilla.github.io/nunjucks/api.html#configure) for more information.

## License

MIT © [Anthony Castle](http://github.com/mrajo)
