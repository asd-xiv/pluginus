<!-- markdownlint-disable first-line-h1 line-length -->

[![CircleCI](https://circleci.com/gh/asd-xiv/pluginus.svg?style=svg)](https://circleci.com/gh/asd-xiv/pluginus)
[![npm version](https://badge.fury.io/js/%40asd14%2Fpluginus.svg)](https://www.npmjs.com/package/%40asd14%2Fpluginus)
[![dev-badge](https://david-dm.org/asd-xiv/pluginus.svg)](https://david-dm.org/asd-xiv/pluginus)
[![Coverage Status](https://coveralls.io/repos/github/asd-xiv/pluginus/badge.svg)](https://coveralls.io/github/asd-xiv/pluginus)

# pluginus

Dependency injection with promise support for Node.js.

<!-- vim-markdown-toc GFM -->

- [Install](#install)
- [Use](#use)
- [Develop](#develop)
- [Changelog](#changelog)

<!-- vim-markdown-toc -->

## Install

```bash
npm install @asd14/pluginus
```

## Use

`plugin-1.js`

```js
exports default {
  /**
   * Which plugins need loading before this one
   *
   * @type {string[]}
   */
  depend: [],

  /**
   * Name other plugins can use to reference and use this plugin
   *
   * @type {string}
   */
  name: "PluginOne",

  /**
   * Factory function, only runs once when ititialized. The value this function
   * returns or resolves to will be passed to other plugins depending on it.
   *
   * @param {any} ...dependentPlugins
   *
   * @returns {* | Promise<*>}
   */
  create: () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          foo: "bar",
        })
      }, 50)
    })
  },
}
```

`plugin-2.js`

```js
module.exports = {
  depend: ["PluginOne"],

  name: "Plugin2",

  create: PluginOne => ({
    lorem: `ipsum ${PluginOne.foo}`,
  }),
}
```

`index.js`

```js
import { pluginus } from "@asd14/pluginus"

pluginus({
  source: ["path-to-plugin1", "path-to-plugin2"],
}).then(({ PluginOne, Plugin2 }) => {
  // PluginOne
  // => {
  //   foo: "bar",
  // }
  // Plugin2
  // => {
  //   lorem: "ipsum bar",
  // }
})
```

## Develop

```bash
git clone git@github.com:asd-xiv/pluginus.git && \
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

See the [releases section](https://github.com/asd-xiv/pluginus/releases) for
details.
