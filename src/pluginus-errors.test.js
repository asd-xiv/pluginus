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
    /Pluginus: "folders" parameter must be a non empty string or an array of strings/,
    "Constructor 'folders' param not set"
  )

  t.end()
})
