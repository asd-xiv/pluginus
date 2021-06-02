/* eslint-disable promise/catch-or-return, unicorn/no-null, unicorn/prefer-module */

import test from "tape"
import glob from "glob"
import path from "path"

import { pluginus } from "./pluginus"

test("Good", t => {
  pluginus({
    source: [
      path.join(__dirname, "/examples/test-ok/depend__on--plain.js"),
      path.join(__dirname, "/examples/test-ok/depend__on--plain.js"),
      null,
      Number.NaN,
      "",
      undefined,
      ...glob.sync(`${__dirname}/examples/test-ok/*.js`, { absolute: true }),
    ],
  })
    .then(plugins => {
      t.deepEquals(
        Object.keys(plugins).sort(),
        ["DependOnPlain", "ExplicitName", "Object", "Plain", "PromisePlugin"],
        "All plugins should be loaded"
      )

      t.equals(
        plugins.DependOnPlain.promiseLorem,
        "lorem promises ipsum",
        "Plugin depending on multiple promise plugins"
      )

      t.equals(
        plugins.ExplicitName.timesConstructorRan(),
        1,
        "Plugin required multiple times should run constructor only once"
      )
    })
    .finally(() => {
      t.end()
    })
})

test("Bad", t => {
  t.throws(
    () => {
      pluginus({
        source: [path.join(__dirname, "/examples/test-not-ok/plain.js")],
      })
    },
    /Pluginus: plugin "NotFound" not found as dependency for "Plain"/,
    "Dependency plugin not found, should throw custom error"
  )

  t.throws(
    () => {
      pluginus({
        source: [path.join(__dirname, "/examples/test-not-ok/not-exist.js")],
      })
    },
    /Pluginus: file path ".*" does not exist/,
    "Input plugin path does not exist, should throw custom error"
  )

  t.end()
})
