<!-- markdownlint-disable first-line-h1 line-length -->

[![CircleCI](https://circleci.com/gh/andreidmt/pluginus.xyz.svg?style=svg)](https://circleci.com/gh/andreidmt/pluginus.xyz)
[![npm version](https://badge.fury.io/js/pluginus.xyz.svg)](https://www.npmjs.com/package/pluginus.xyz)
[![dev-badge](https://david-dm.org/andreidmt/pluginus.xyz.svg)](https://david-dm.org/andreidmt/pluginus.xyz)
[![Coverage Status](https://coveralls.io/repos/github/andreidmt/pluginus.xyz/badge.svg)](https://coveralls.io/github/andreidmt/pluginus.xyz)

# pluginus

<!-- vim-markdown-toc GFM -->

* [Install](#install)
* [Use](#use)
* [Develop](#develop)
* [Changelog](#changelog)

<!-- vim-markdown-toc -->

## Install

```bash
npm install pluginus.xyz
```

## Use

`plugin-1.js`

```js
exports default {
  create: () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          foo: "bar",
        })
      }, 50)
    }),
}
```

`plugin-2.js`

```js
module.exports = {
  // First "Plugin1" is resolved to { foo: "bar" }
  depend: ["Plugin1"],

  // After dependencies are resolved, the current constructor is called
  create: Plugin1 => ({
    lorem: `ipsum ${Plugin1.foo}`,
  }),
}
```

`index.js`

```js
import { pluginus } from "pluginus.xyz"

pluginus({
  files: ["path-to-plugin1", "path-to-plugin2"],
}).then(({ Plugin1, Plugin2 }) => {
  // Plugin1
  // => {
  //   foo: "bar",
  // }
  //
  // Plugin2
  // => {
  //   lorem: "ipsum bar",
  // }
})
```

## Develop

```bash
git clone git@github.com:andreidmt/pluginus.xyz.git && \
  cd pluginus && \
  npm run setup
```

Run all `*.test.js` in `src` folder

```bash
npm test
```

Watch `src` and `examples` folder for changes and re-run tests

```bash
npm run tdd
```

## Changelog

See the [releases section](https://github.com/andreidmt/pluginus.xyz/releases) for details.
