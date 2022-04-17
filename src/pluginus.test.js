/* eslint-disable promise/catch-or-return, unicorn/no-null */

import test from "tape"
import glob from "glob"
import path from "path"

import { pluginus } from "./pluginus.js"

const __dirname = new URL(".", import.meta.url).pathname

test("Happy", async t => {
  const plugins = await pluginus({
    source: [
      path.join(__dirname, "/examples/happy/depend__on--plain.js"),
      path.join(__dirname, "/examples/happy/depend__on--plain.js"),
      null,
      Number.NaN,
      "",
      undefined,
      ...glob.sync(`${__dirname}/examples/happy/*.js`, { absolute: true }),
    ],
  })

  t.deepEquals(
    Object.keys(plugins).sort(),
    ["DependOnPlain", "ExplicitName", "Object", "Plain", "PromisePlugin"],
    'given [pluginus called with invalid values in "source" param] should [sanitize and load only valid]'
  )

  t.deepEquals(
    plugins.DependOnPlain,
    { lorem: "ipsum", foo: "bar", ping: "pong" },
    "given [plugin with multiple dependencies] should [successfully resolve all]"
  )

  t.equals(
    plugins.ExplicitName.timesConstructorRan(),
    1,
    'given [plugin required multiple time] should [run "create" once]'
  )
})

test("Happy not", async t => {
  try {
    await pluginus({
      source: [path.join(__dirname, "/examples/happy-not/plain.js")],
    })
  } catch (error) {
    t.equals(
      error.message,
      'Pluginus: plugin "NotFound" not found as dependency for "Plain"',
      "given [dependant plugin does not exist] should [throw]"
    )
  }

  try {
    await pluginus({
      source: [path.join(__dirname, "/examples/happy-not/not-exist.js")],
    })
  } catch (error) {
    t.match(
      error.message,
      /Pluginus: file path ".*" does not exist/,
      "given [plugin path does not exist] should [throw]"
    )
  }

  try {
    await pluginus({
      source: [path.join(__dirname, "/examples/happy-not/no-create-fn.js")],
    })
  } catch (error) {
    t.match(
      error.message,
      /Pluginus: file path ".*" does not export a "create" function/,
      "given [plugin with no create function defined] should [throw]"
    )
  }
})
