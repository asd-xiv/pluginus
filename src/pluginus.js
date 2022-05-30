/* eslint-disable no-sync */

import fs from "fs"
import path from "path"
import {
  all,
  pipe,
  pick,
  findWith,
  reduce,
  distinct,
  remove,
  dropLast,
  map,
  when,
  pipeP,
  split,
  read,
  unite,
  toLower,
  is,
  isEmpty,
  any,
} from "@asd14/m"

const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

const defaultNameFn = pipe(
  split(/[._|-]/),
  dropLast,
  map([toLower, capitalizeFirstLetter]),
  unite("")
)

/**
 * Dependency injection with promise support.
 *
 * @param {Object}   props
 * @param {string[]} props.source Array of file paths with plugin definition
 * @param {Function} props.nameFn Transform file name into plugin name.
 *                                This name is used in `depends` field.
 *
 * @returns {Promise<Object<string, *>>} Promise resolving to an object with
 * plugin indexed by name
 *
 * @name pluginus
 * @signature ({source: string[], nameFn: Function}): Promise<Object>
 *
 * @example
 * // plugins/plugin-1.js
 * module.exports = {
 *   depend: [],
 *
 *   name: "PluginOne",
 *
 *   create: () => {
 *     return new Promise(resolve => {
 *       setTimeout(() => {
 *         resolve({
 *           foo: "bar",
 *         })
 *       }, 50)
 *     })
 *   },
 * }
 *
 * // plugins/plugin-2.js
 * exports default {
 *   depend: ["PluginOne"],
 *
 *   name: "Plugin2",
 *
 *   create: PluginOne => ({
 *     lorem: `ipsum ${PluginOne.foo}`,
 *   }),
 * }
 *
 * // index.js
 * import path from "path"
 * import { pluginus } from "@asd14/pluginus"
 *
 * pluginus({
 *   source: [
 *     path.resolve("./plugins/plugin-1.js"),
 *     path.resolve("./plugins/plugin-2.js"),
 *   ]
 * }).then(({ PluginOne, Plugin2 }) => {
 *   // PluginOne
 *   // => { foo: "bar" }
 *
 *   // Plugin2
 *   // => { lorem: "ipsum bar" }
 * })
 */

// Check file exists and prepare all plugins for loading
const load = map(importPath => {
  if (!fs.existsSync(importPath)) {
    throw new Error(`Pluginus: file path "${importPath}" does not exist`)
  }

  return import(importPath).then(result => [importPath, result])
})

// Check all plugins have a "create" function and set defaults
const prepare = nameFn =>
  map(([importPath, importResult]) => {
    const plugin = read("default", {}, importResult)

    if (typeof plugin.create !== "function") {
      throw new TypeError(
        `Pluginus: file path "${importPath}" does not export a "create" function`
      )
    }

    return {
      name: pipe(
        read("name"),
        when(isEmpty, () => nameFn(path.basename(importPath)))
      )(plugin),
      depend: read("depend", [], plugin),
      create: plugin.create,
    }
  })

const resolve = unresolvedPlugins => {
  const loaded = {}

  const resolveOne = ({ name, depend, create }) => {
    if (is(loaded[name])) {
      return loaded[name]
    }

    return (loaded[name] = pipeP(
      map(item => {
        if (!is(loaded[item])) {
          throw new Error(
            `Pluginus: plugin "${item}" not found as dependency for "${name}"`
          )
        }

        return loaded[item]
      }),

      // pipeP will not know to resolve array or Promise.all over array
      input_ => Promise.all(input_),

      // with dependencies resolved, run current plugin constructor
      dependencies => create(...map(item => item.resolvedValue, dependencies)),

      // return plugin content and name
      resolvedValue => ({
        name,
        resolvedValue,
      })
    )(depend))
  }

  return pipeP(
    map(resolveOne),
    plugins => Promise.all(plugins),
    reduce(
      (acc, item) => ({
        ...acc,
        [item.name]: item.resolvedValue,
      }),
      {}
    )
  )(unresolvedPlugins)
}

// Sort based on dependency topology, using TSort
// https://en.wikipedia.org/wiki/Topological_sorting
const tSort = (names, input, start = [], depth = 0) => {
  const processed = reduce((accum, item) => {
    const plugin = findWith({ name: item }, {})(input)

    const allDependenciesIncluded = pipe(
      read("depend", []),
      all(dependency => any(dependency, pick("name")(accum)))
    )(plugin)

    if (allDependenciesIncluded) {
      accum.push(plugin)
    }

    return accum
  }, start)(names)

  const nextNames = names.filter(n => !processed.includes(n)),
    goAgain = nextNames.length !== 0 && depth <= names.length

  return goAgain ? tSort(nextNames, input, processed, depth + 1) : processed
}

export const pluginus = ({ source, nameFn = defaultNameFn }) =>
  pipeP(
    // Sanitize
    remove(isEmpty),
    distinct,

    //
    load,
    plugins => Promise.all(plugins),
    prepare(nameFn),

    plugins => tSort(pick("name", plugins), plugins),

    //
    resolve
  )(source)
