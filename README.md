
<!-- markdownlint-disable line-length -->
[![npm package version](https://badge.fury.io/js/%40asd14%2Fpluginus.svg)](https://badge.fury.io/js/%40asd14%2Fpluginus)
[![Coverage Status](https://coveralls.io/repos/github/asd14/pluginus/badge.svg)](https://coveralls.io/github/asd14/pluginus)

# pluginus

> Something that runs after another thing ends and can use that thing to do it's own thing (Async plugin dependency loader)

<!-- MarkdownTOC levels="1,2,3" autolink="true" indent="  " -->

- [Install](#install)
- [Develop](#develop)
- [Use](#use)
- [Changelog](#changelog)
  - [0.3.0 - 15 October 2018](#030---15-october-2018)

<!-- /MarkdownTOC -->

## Install

```bash
npm i --save-exact @asd14/pluginus
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

  create: (Thing) => {
    // Thing resolves to { foo: "bar" }

    return {
      lorem: `ipsum ${Thing.foo}`,
    }
  },
}

// index.js
const path = require("path")
const pluginus = require("@asd14/pluginus")

pluginus({
  folders: "plugins",
}).then(([Thing, Something]) => {
  // Thing resolves to { foo: "bar" }
  // Something resolves to { lorem: "ipsum bar" }
})
```

## Changelog

History of all changes in [CHANGELOG.md](/CHANGELOG.md)

### 0.3.0 - 15 October 2018

#### Added

- Add test coverage and [coveralls](https://coveralls.io/github/asd14/pluginus) badge

#### Changed

- Changed `files` param to also accept an array of either string or regular expressions. Duplicate files are deleted.
- Rename `root` param to `folders`. Accept more than one folders where to scan for files.
