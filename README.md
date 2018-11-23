
<!-- markdownlint-disable line-length -->
[![npm package version](https://badge.fury.io/js/%40asd14%2Fpluginus.svg)](https://badge.fury.io/js/%40asd14%2Fpluginus)
[![Coverage Status](https://coveralls.io/repos/github/asd14/pluginus/badge.svg)](https://coveralls.io/github/asd14/pluginus)

# pluginus

> Something that runs after another thing ends and can use that thing to do it's own thing (Async plugin dependency loader)

<!-- MarkdownTOC levels="1,2,3" autolink="true" indent="  " -->

- [Install](#install)
- [Use](#use)
- [Develop](#develop)
- [Changelog](#changelog)
  - [0.5.0 - 23 November 2018](#050---23-november-2018)

<!-- /MarkdownTOC -->

## Install

```bash
npm i --save-exact @asd14/pluginus
```

## Use

```js
// plugins/thing.plugin.js
module.exports = {
  create: (/* seed */) => () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          foo: "bar",
        })
      }, 50)
    }),
}

// plugins/something.plugin.js
module.exports = {
  depend: ["Thing"],

  // First "Thing" is resolved to { foo: "bar" } and then continue with create
  create: seed => Thing => ({
    loremPlugin: `ipsum ${Thing.foo}`,
    ...seed,
  }),
}

// index.js
const path = require("path")
const pluginus = require("@asd14/pluginus")

pluginus({
  seed: {
    loremSeed: "ipsum",
  },
  folders: path.join(__dirname, "plugins"),
}).then(({ Thing, Something }) => {
  // {
  //   Thing: { foo: "bar" },
  //   Something: { loremPlugin: "ipsum bar", loremSeed: "ipsum", }
  // }
})
```

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

### 0.5.0 - 23 November 2018

#### Add

- Add init function property `seed`, passed to all plugin factory functions

#### Change

- Remane init property `handleName` to `name`
- Individual plugin's factory function is curried with the `seed` as the only param of the first function and depencies as params of the second

#### Remove

- Remove init property `handleCreate`
