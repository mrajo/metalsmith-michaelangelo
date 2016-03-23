# metalsmith-michaelangelo

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
template in `options.directory` to render.

### default
Type: `string`
Default: `default.html`

Defines a default template to use if the file being rendered doesn't specify a
template in its front matter with `options.templateKey`.

### pattern
Type: `string`
Default: `**/*.html`

Defines a glob pattern for [micromatch](https://github.com/jonschlinkert/micromatch) to determine which files to render. If `null`, only files with `options.templateKey` defined in front matter will be rendered.

### filters
Type: `object`
Default: `{}`

Defines a collection of custom filters to add to the Nunjucks Environment.

## License

MIT © [Anthony Castle](http://github.com/mrajo)
