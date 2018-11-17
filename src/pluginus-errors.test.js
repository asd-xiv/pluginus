const test = require("blue-tape")
const path = require("path")

const pluginus = require("./pluginus")

test("Errors", t => {
  t.throws(
    () => {
      pluginus({
        folders: path.resolve("./examples/test-not-ok/dependency-not-found"),
      })
    },
    /Pluginus: Dependency not found: "WrongPluginName"/,
    "Name in plugin's dependency does not exist"
  )

  t.throws(
    () => {
      pluginus({
        folders: path.resolve("./examples/test-not-ok/duplicate-name"),
      })
    },
    /Pluginus: Duplicate name error: "Plain"/,
    "Multiple plugins have the same name"
  )

  t.throws(
    () => {
      pluginus()
    },
    /Pluginus: "folders" parameter must be a non empty string or array of strings/,
    "Constructor 'folders' not set"
  )

  t.throws(
    () => {
      pluginus({
        folders: path.resolve("./does-not-exist"),
      })
    },
    /Pluginus: the following "folder" paths do not exist/,
    "Constructor 'folders' does not exist"
  )

  t.throws(
    () => {
      pluginus({
        folders: path.resolve("./examples/test-ok"),
        files: ["asd"],
      })
    },
    /Pluginus: the following \"file\" paths do not exist/,
    "Constructor 'files' contain paths that dont exist"
  )

  t.end()
})
