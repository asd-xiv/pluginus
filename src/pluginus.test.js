/* eslint-disable promise/catch-or-return */

import test from "tape"
import path from "path"

import { pluginus } from "./pluginus"

test("Working as intended", t => {
  pluginus({
    props: {
      foo: "bar",
    },
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

test("Not working", t => {
  t.throws(
    () => {
      pluginus({
        props: {
          foo: "bar",
        },
      })([path.resolve("./examples/test-not-ok/plain.js")])
    },
    /Pluginus: plugin "NotFound" not found as dependency for "Plain"/,
    "Dependency plugin not found, should throw custom error"
  )

  t.throws(
    () => {
      pluginus({
        props: {
          foo: "bar",
        },
      })([path.resolve("./examples/test-not-ok/not-exist.js")])
    },
    /Pluginus: file path ".*" does not exist/,
    "Input plugin path does not exist, should throw custom error"
  )

  t.end()
})
