/* eslint-disable no-sync */

import fs from "fs"
import path from "path"
import {
  pipe,
  sortBy,
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
  has,
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

      /* eslint-disable unicorn/prefer-module  */

      // support es6 & commonjs export
      const plugin = require(item)
      const pluginDef = is(plugin.default) ? plugin.default : plugin

      return {
        name: pipe(
          read("name"),
          when(isEmpty, () => nameFn(path.basename(item)))
        )(pluginDef),
        depend: read("depend", [], pluginDef),
        create: pluginDef.create,
      }
    }),

    // Sort based on dependency. Plugins without dependencies first
    sortBy((a, b) => {
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
          source_ => Promise.all(source_),

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
