const test = require("blue-tape")
const path = require("path")

const pluginus = require("./pluginus")

test("Defaults", async t => {
  const plugins = await pluginus({
    folders: path.resolve("fixtures/ok"),
  })

  t.equals(Object.entries(plugins).length, 4, "All plugins loaded")

  t.equals(
    plugins.Plain.get("lorem"),
    "ipsum",
    "Plugin loads and returns object"
  )

  t.equals(
    plugins.Dependent.get("lorem"),
    "ipsum",
    "Plugin resolves dependencies before loads"
  )

  t.deepEquals(
    plugins.Promise,
    { promiseLorem: "lorem promises ipsum" },
    "Promise plugin loads and is resolved"
  )
})
