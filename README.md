<!-- markdownlint-disable first-line-h1 line-length -->

[![CircleCI](https://circleci.com/gh/asd-xiv/pluginus.svg?style=svg)](https://circleci.com/gh/asd-xiv/pluginus)
[![npm version](https://badge.fury.io/js/%40asd14%2Fpluginus.svg)](https://www.npmjs.com/package/%40asd14%2Fpluginus)
[![dev-badge](https://david-dm.org/asd-xiv/pluginus.svg)](https://david-dm.org/asd-xiv/pluginus)
[![Coverage Status](https://coveralls.io/repos/github/asd-xiv/pluginus/badge.svg)](https://coveralls.io/github/asd-xiv/pluginus)

# pluginus

Simple and fast dependency injection with promise support.

<!-- vim-markdown-toc GFM -->

* [Install](#install)
* [Use](#use)
* [Develop](#develop)
* [Changelog](#changelog)

<!-- vim-markdown-toc -->

## Install

```bash
npm install @asd14/pluginus
```

## Use

`plugin-1.js`

```js
exports default {
  // If not present, name will be generated from filename
  name: "LoremIpsum",
  
  // No dependencies defined, will run first
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
import { pluginus } from "@asd14/pluginus"

pluginus({
  source: ["path-to-plugin1", "path-to-plugin2"],
}).then(({ Plugin1, LoremIpsum }) => {
  // Plugin1
  // => {
  //   foo: "bar",
  // }
  
  // LoremIpsum
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

See the [releases section](https://github.com/asd-xiv/pluginus/releases) for details.
