
<!-- markdownlint-disable line-length -->
[![npm package version](https://badge.fury.io/js/%40asd14%2Fpluginus.svg)](https://badge.fury.io/js/%40asd14%2Fpluginus)
[![Coverage Status](https://coveralls.io/repos/github/asd14/pluginus/badge.svg)](https://coveralls.io/github/asd14/pluginus)

# pluginus

> Something that runs after another thing and can use that thing to do it's own thing (Async plugin dependency container)

<!-- MarkdownTOC levels="1,2,3" autolink="true" indent="  " -->

- [Install](#install)
- [Develop](#develop)
- [Changelog](#changelog)
  - [0.3.0 - 15 October 2018](#030---15-october-2018)

<!-- /MarkdownTOC -->

## Install

## Develop

## Changelog

History of all changes in [CHANGELOG.md](/CHANGELOG.md)

### 0.3.0 - 15 October 2018

#### Added

- Add test coverage and [coveralls](https://coveralls.io/github/asd14/pluginus) badge

#### Changed

- Changed `files` param to also accept an array of either string or regular expressions. Duplicate files are deleted.
- Rename `root` param to `folders`. Accept more than one folders where to scan for files.
