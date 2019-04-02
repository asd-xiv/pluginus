<!-- markdownlint-disable first-line-h1 line-length -->

[![npm package version](https://badge.fury.io/js/%40asd14%2Fpluginus.svg)](https://badge.fury.io/js/%40asd14%2Fpluginus)
[![Coverage Status](https://coveralls.io/repos/github/asd14/pluginus/badge.svg)](https://coveralls.io/github/asd14/pluginus)

# pluginus

> Things that get ran after other things. Dependency injection with promise support.

<!-- vim-markdown-toc GFM -->

* [Install](#install)
* [Use](#use)
* [API](#api)
* [Develop](#develop)
* [Changelog](#changelog)
  * [0.6.1 - 2 April 2019](#061---2-april-2019)
    * [Change](#change)
    * [Remove](#remove)

<!-- vim-markdown-toc -->

## Install

```bash
npm i @asd14/pluginus
```

## Use

```js
// plugins/thing.js
exports default {
  create: props => () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          foo: props.foo,
        })
      }, 50)
    }),
}

// plugins/second-thing.js
exports default {
  depend: ["Thing"],

  // First "Thing" is resolved to { foo: "bar" } and then continue with create
  create: props => Thing => ({
    ThingContent: `ipsum ${Thing.foo}`,
    ...props,
  }),
}

// index.js
import path from "path"
import { pluginus } from "@asd14/pluginus"

pluginus({
  props: {
    foo: "bar",
  },
})([
  path.resolve("./plugins/thing.js"),
  path.resolve("./plugins/second-thing.js"),
]).then(({ Thing, SecondThing }) => {
  // Thing
  // => { foo: "bar" }
  
  // SecondThing
  // => { ThingContent: "ipsum bar", foo: "bar" }
})
```

## API

## Develop

```bash
git clone git@github.com:asd14/pluginus.git && \
  cd pluginus && \
  npm run setup

# run tests (any `*.test.js`) once
npm test

# watch `src` folder for changes and run test automatically
npm run tdd
```

## Changelog

History of all changes in [CHANGELOG.md](/CHANGELOG.md)

### 0.6.1 - 2 April 2019

#### Change

* Default function for name transformation supports BEM in file names

#### Remove

* Babel support for pipeline operator
