<!-- markdownlint-disable first-line-h1 line-length -->

[![CircleCI](https://circleci.com/gh/mutant-ws/pluginus.svg?style=svg)](https://circleci.com/gh/mutant-ws/pluginus)
[![npm package version](https://badge.fury.io/js/%40mutant-ws%2Fpluginus.svg)](https://badge.fury.io/js/%40mutant-ws%2Fpluginus)
[![Coverage Status](https://coveralls.io/repos/github/mutant-ws/pluginus/badge.svg)](https://coveralls.io/github/mutant-ws/pluginus)

# pluginus

> Dependency injection with promise support - Things that get ran after other things.

<!-- vim-markdown-toc GFM -->

* [Install](#install)
* [Use](#use)
* [Develop](#develop)
* [Commit Message Format](#commit-message-format)
* [Changelog](#changelog)

<!-- vim-markdown-toc -->

## Install

```bash
npm install @mutant-ws/pluginus
```

## Use

`plugins/thing.js`

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

`plugins/second-thing.js`

```js
module.exports = {
  // First "Thing" is resolved to { foo: "bar" }
  depend: ["Thing"],

  // After dependencies are resolved, the current constructor is called
  create: Thing => ({
    ThingContent: `ipsum ${Thing.foo}`,
  }),
}
```

`index.js`

```js
import glob from "glob"
import { pluginus } from "@mutant-ws/pluginus"

pluginus({
  files: glob.sync("./plugins/*.js", { absolute: true }),
}).then(({ Thing, SecondThing }) => {
  // Thing
  // => {
  //   foo: "bar",
  // }
  // SecondThing
  // => {
  //   ThingContent: "ipsum bar",
  // }
})
```

## Develop

```bash
git clone git@github.com:mutant-ws/pluginus.git && \
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

## Commit Message Format

Using Angular's [conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

## Changelog

See the [releases section](https://github.com/mutant-ws/pluginus/releases) for details.
