const test = require("blue-tape")
const path = require("path")

const pluginus = require("./pluginus")

test("Defaults", async t => {
  const plugins = await pluginus({
    folders: path.resolve("fixtures/ok"),
  })

  t.equals(Object.entries(plugins).length, 4, "All plugins loaded")

  t.deepEquals(plugins.Plain.get("lorem"), "ipsum", "Plugin returns object")

  t.deepEquals(
    plugins.Promise,
    { promiseLorem: "lorem promises ipsum" },
    "Plugin returns promise"
  )

  t.deepEquals(
    plugins.Dependent.get("lorem"),
    "ipsum",
    "Plugin loads with dependencies"
  )
})

test("Custom props", async t => {
  const pluginSet1 = await pluginus({
    folders: path.resolve("fixtures/ok"),
    files: [/plain\.plugin\.js/, path.resolve("./fixtures/ok/plain.plugin.js")],
    handleName: fileName => fileName.replace(".plugin.js", "").toUpperCase(),
  })

  t.equals(
    Object.entries(pluginSet1).length,
    1,
    "Load plugins with array of files and regExp. Duplicate file names are deleted."
  )

  t.equals(typeof pluginSet1.PLAIN, "object", "Custom name function")

  const pluginSet2 = await pluginus({
    folders: path.resolve("fixtures/ok"),
    files: /object\.plugin\.js/,
    handleCreate: (pluginExport, depenpencies = []) => ({
      ...pluginExport,
      dependencies: depenpencies.length,
      addedInFactory: true,
    }),
  })

  t.deepEquals(
    pluginSet2.Object,
    {
      lorem: "ipsum",
      dependencies: 0,
      addedInFactory: true,
    },
    "Custom plugin factory function"
  )

  const pluginSet3 = await pluginus({
    folders: [path.resolve("fixtures/ok"), path.resolve("fixtures/still-ok")],
    files: [/object/],
  })

  t.equals(
    Object.entries(pluginSet3).length,
    2,
    "Load plugins from multiple folders"
  )
})

test("Errors", t => {
  t.throws(
    () => {
      pluginus({
        folders: path.resolve("fixtures/notOk/dependency-not-found"),
      })
    },
    /Pluginus: Dependency not found: "WrongPluginName"/,
    "Name in plugin's dependency does not exist"
  )

  t.throws(
    () => {
      pluginus({
        folders: path.resolve("fixtures/notOk/duplicate-name"),
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
