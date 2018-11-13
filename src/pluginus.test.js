const test = require("blue-tape")
const path = require("path")

const pluginus = require("./pluginus")

test("Defaults", async t => {
  const plugins = await pluginus({
    root: path.resolve("fixtures/ok"),
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
    root: path.resolve("fixtures/ok"),
    fileMatch: /plain\.plugin\.js/,
    handleName: fileName => fileName.replace(".plugin.js", "").toUpperCase(),
  })

  t.equals(
    Object.entries(pluginSet1).length,
    1,
    'All plugins loaded based on custom "fileMatch" RegExp'
  )

  t.equals(typeof pluginSet1.PLAIN, "object", "Custom name function")

  const pluginSet2 = await pluginus({
    root: path.resolve("fixtures/ok"),
    fileMatch: /object\.plugin\.js/,
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
})

test("Exceptions", t => {
  t.throws(
    () => {
      pluginus({
        root: path.resolve("fixtures/notOk/dependency-not-found"),
      })
    },
    /Pluginus: Dependency not found: "WrongPluginName"/,
    "Dependency plugin is not found"
  )

  t.throws(
    () => {
      pluginus({
        root: path.resolve("fixtures/notOk/duplicate-name"),
      })
    },
    /Pluginus: Duplicate name error: "Plain"/,
    "Multiple plugins have the same name"
  )

  t.end()
})
