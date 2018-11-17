
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
  - [0.4.0 - 17 October 2018](#040---17-october-2018)

<!-- /MarkdownTOC -->

## Install

```bash
npm i --save-exact @asd14/pluginus
```

## Use

```js
// plugins/thing.plugin.js
module.exports = {
  create: () =>
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

  // First "Thing" resolves to { foo: "bar" } and then continue with create
  create: Thing => ({
    lorem: `ipsum ${Thing.foo}`,
  }),
}

// index.js
const path = require("path")
const pluginus = require("@asd14/pluginus")

pluginus({
  folders: path.join(__dirname, "plugins"),
}).then(({ Thing, Something }) => {
  // {
  //   Thing: { foo: 'bar' },
  //   Something: { lorem: 'ipsum bar' }
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

### 0.4.0 - 17 October 2018

#### Changed

- Check "folders" and "files" exist
