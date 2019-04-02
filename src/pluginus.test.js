/* eslint-disable promise/catch-or-return */

import test from "tape"
import path from "path"

import { pluginus } from "./pluginus"

test("Pluginus", t => {
  pluginus({
    props: {
      foo: "bar",
    },
    // nameFn: item => item.replace(".plugin.js", "").toUpperCase(),
  })([
    path.resolve("./examples/test-ok/depend__on--plain.js"),
    path.resolve("./examples/test-ok/depend__on--plain.js"),
    path.resolve("./examples/test-ok/promise-plugin.js"),
    null,
    NaN,
    "",
    undefined,
    path.resolve("./examples/test-ok/plain.js"),
    path.resolve("./examples/test-ok/plain.js"),
    path.resolve("./examples/test-ok/object.js"),
    path.resolve("./examples/test-ok/plain-2.js"),
  ])
    .then(plugins => {
      t.deepEquals(
        Object.keys(plugins).sort(),
        ["DependOnPlain", "Object", "Plain", "Plain2", "PromisePlugin"],
        "All plugins should be loaded"
      )

      t.equals(
        plugins.DependOnPlain.promiseLorem,
        "lorem promises ipsum",
        "Plugin depending on multiple promise plugins"
      )

      t.equals(
        plugins.Plain.get("foo"),
        "bar",
        "Props data passed to plugin constructor"
      )

      t.equals(
        plugins.Plain2.timesConstructorRan(),
        1,
        "Plugin required multiple times should run constructor only once"
      )
    })
    .finally(() => {
      t.end()
    })
})
