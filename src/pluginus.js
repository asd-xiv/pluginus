/* eslint-disable no-sync */

import fs from "fs"
import { basename } from "path"
import {
  pipe,
  sort,
  reduce,
  distinct,
  remove,
  dropLast,
  map,
  when,
  pipeP,
  split,
  read,
  join,
  toLower,
  is,
  isEmpty,
  has,
} from "@asd14/m"

const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

const defaultNameFn = pipe(
  split(/[-._|]/),
  dropLast,
  map([toLower, capitalizeFirstLetter]),
  join("")
)

/**
 * Dependency injection with promise support.
 *
 * @param {string[]} opt.source Array of file paths with plugin definition
 * @param {Function} opt.nameFn Transform file name into plugin name.
 *                              This name is used in `depends` field.
 *
 * @return {Promise<Object<PluginName, *>>} Promise resolving to an object with
 *                                          plugin contents indexed by name
 *
 * @name pluginus
 * @signature ({source: string[], nameFn: Function}): Promise<Object>
 *
 * @example
 * // plugins/thing.js
 * exports default {
 *   create: () =>
 *     new Promise(resolve => {
 *       setTimeout(() => {
 *         resolve({
 *           foo: "bar",
 *         })
 *       }, 50)
 *     }),
 * }
 *
 * // plugins/second-thing.js
 * exports default {
 *   depend: ["Thing"],
 *
 *   // First "Thing" is resolved to { foo: "bar" } and then continue with create
 *   create: Thing => ({
 *     ThingContent: `ipsum ${Thing.foo}`,
 *   }),
 * }
 *
 * // index.js
 * import path from "path"
 * import { pluginus } from "@asd14/pluginus"
 *
 * pluginus({
 *   source: [
 *     path.resolve("./plugins/thing.js"),
 *     path.resolve("./plugins/second-thing.js"),
 *   ]
 * }).then(({ Thing, SecondThing }) => {
 *   // Thing
 *   // => { foo: "bar" }
 *
 *   // SecondThing
 *   // => { ThingContent: "ipsum bar" }
 * })
 */
export const pluginus = ({ source, nameFn = defaultNameFn } = {}) =>
  pipe(
    // Sanitize
    remove(isEmpty),
    distinct,

    // Check file exists and prepare all plugins for loading
    map(item => {
      if (!fs.existsSync(item)) {
        throw new Error(`Pluginus: file path "${item}" does not exist`)
      }

      // support es6 & commonjs export
      const plugin = require(item)
      const pluginDef = is(plugin.default) ? plugin.default : plugin

      return {
        name: pipe(
          read("name"),
          when(isEmpty, () => nameFn(basename(item)))
        )(pluginDef),
        depend: read("depend", [], pluginDef),
        create: pluginDef.create,
      }
    }),

    // Sort based on dependency. Plugins without dependencies first
    sort((a, b) => {
      const aHasB = has(b.name, a.depend)
      const bHasA = has(a.name, b.depend)

      if (!aHasB && !bHasA) {
        return a.depend.length > b.depend.length ? 1 : -1
      }

      return bHasA ? -1 : 1
    }),

    // Load all plugins
    unresolvedPlugins => {
      const loaded = {}

      const loadOne = ({ name, depend, create }) => {
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
          input => Promise.all(input),

          // with dependencies resolved, run current plugin constructor
          dependencies =>
            create(...map(item => item.resolvedValue, dependencies)),

          // return plugin content and name
          resolvedValue => ({
            name,
            resolvedValue,
          })
        )(depend))
      }

      return pipeP(
        map(loadOne),
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
  )(source)
