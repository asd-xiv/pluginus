const test = require("blue-tape")
const path = require("path")

const pluginus = require("./pluginus")

test("Custom props", async t => {
  const pluginSet1 = await pluginus({
    seed: {
      foo: "bar",
    },
    folders: path.resolve("./examples/test-ok"),
    files: [
      /plain\.plugin\.js/,
      path.resolve("./examples/test-ok/plain.plugin.js"),
    ],
    name: fileName => fileName.replace(".plugin.js", "").toUpperCase(),
  })

  t.equals(
    Object.entries(pluginSet1).length,
    1,
    "Load plugins with array of files and regExp. Duplicate file names are deleted."
  )

  t.equals(
    pluginSet1.PLAIN.get("foo"),
    "bar",
    "Seed data passed to plugin constructor"
  )

  t.equals(typeof pluginSet1.PLAIN, "object", "Custom name function")

  const pluginSet2 = await pluginus({
    folders: [
      path.resolve("./examples/test-ok"),
      path.resolve("./examples/test-still-ok"),
    ],
    files: [/object/],
  })

  t.equals(
    Object.entries(pluginSet2).length,
    2,
    "Load plugins from multiple folders"
  )
})
