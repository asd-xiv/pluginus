<!-- markdownlint-disable no-duplicate-header line-length -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.3] - 10 April 2019

### Change

* Plugin files can use both commonjs and ES6 export syntax 

## [0.6.2] - 6 April 2019

### Change

* Add tests for error: plugin dependency not found, plugin path not found

## [0.6.1] - 2 April 2019

### Change

* Default function for name transformation supports BEM in file names

### Remove

* Babel support for pipeline operator

## [0.6] - 1 April 2019

### Change

* Rewrite - droping folder scanning functionality. Plugin file paths should be provided.
* Fix [#2](https://github.com/asd14/pluginus/issues/2), bug where constructor would be called every time plugin was referenced

## [0.5.1] - 1 January 2019

### Change

* Update packages

## [0.5.0] - 23 November 2018

### Add

* Add init function property `seed`, passed to all plugin factory functions

### Change

* Remane init property `handleName` to `name`
* Individual plugin's factory function is curried with the `seed` as the only param of the first function and depencies as params of the second

### Remove

* Remove init property `handleCreate`

## [0.4.0] - 17 October 2018

### Change

* Check "folders" and "files" exist

## [0.3.1] - 15 October 2018

### Change

* Update packages

## [0.3.0] - 15 October 2018

### Added

* Add test coverage and [coveralls](https://coveralls.io/github/asd14/pluginus) badge

### Change

* Change `files` param to also accept an array of either string or regular expressions. Duplicate files are deleted.
* Rename `root` param to `folders`. Accept more than one folder where to scan for files.

[Unreleased]: https://github.com/asd14/pluginus/compare/v0.6.3...HEAD

[0.6.3]: https://github.com/asd14/pluginus/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/asd14/pluginus/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/asd14/pluginus/compare/v0.6.0...v0.6.1
[0.6]: https://github.com/asd14/pluginus/compare/v0.5.1...v0.6
[0.5.1]: https://github.com/asd14/pluginus/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/asd14/pluginus/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/asd14/pluginus/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/asd14/pluginus/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/asd14/pluginus/compare/v0.3.0
