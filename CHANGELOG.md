<!-- markdownlint-disable no-duplicate-header line-length -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.0] - 1 April 2019

### Changed

* Rewrite
* Fix #2, bug where constructor would be called every time plugin was referenced

## [0.5.1] - 1 January 2019

### Changed

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

### Changed

* Check "folders" and "files" exist

## [0.3.1] - 15 October 2018

### Changed

* Update packages

## [0.3.0] - 15 October 2018

### Added

* Add test coverage and [coveralls](https://coveralls.io/github/asd14/pluginus) badge

### Changed

* Changed `files` param to also accept an array of either string or regular expressions. Duplicate files are deleted.
* Rename `root` param to `folders`. Accept more than one folder where to scan for files.

[Unreleased]: https://github.com/asd14/pluginus/compare/v0.6...HEAD

[0.6]: https://github.com/asd14/pluginus/compare/v0.5.1...v0.6
[0.5.1]: https://github.com/asd14/pluginus/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/asd14/pluginus/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/asd14/pluginus/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/asd14/pluginus/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/asd14/pluginus/compare/v0.3.0
