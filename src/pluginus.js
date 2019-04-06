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
  findBy,
  map,
  pipeP,
  split,
  join,
  toLower,
  is,
  isEmpty,
  has,
} from "@asd14/m"

const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

const defaultNameFn = pipe(
  split(/[\.|\-\-|\-|__|_]/),
  dropLast,
  map(toLower, capitalizeFirstLetter),
  join("")
)

/**
 * Dependency injection with promise support.
 *
 * @name
 * pluginus
 *
 * @signature
 * ({props: *, nameFn: Function}) => (files: string[]): Promise<Object>
 *
 * @param  {Object}    options         Plugin set config options
 * @param  {*}         options.props   Value that gets passed to all plugins
 *                                     when constructor is ran
 * @param  {Function}  opitons.nameFn  Transform file name into plugin name.
 *                                     This name is used in `depends` field.
 *
 * @param  {string[]}  files  Array of file paths with files containing
 *                            plugin definition
 *
 * @return {Promise<Object<PluginName, *>>} Promise resolving to an object
 *                                          with plugin contents indexed by
 *                                          their name
 *
 * @example
 * // plugins/thing.js
 * exports default {
 *   create: props => () =>
 *     new Promise(resolve => {
 *       setTimeout(() => {
 *         resolve({
 *           foo: props.foo,
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
 *   create: props => Thing => ({
 *     ThingContent: `ipsum ${Thing.foo}`,
 *     ...props,
 *   }),
 * }
 *
 * // index.js
 * import path from "path"
 * import { pluginus } from "@asd14/pluginus"
 *
 * pluginus({
 *   props: {
 *     foo: "bar",
 *   },
 * })([
 *   path.resolve("./plugins/thing.js"),
 *   path.resolve("./plugins/second-thing.js"),
 * ]).then(({ Thing, SecondThing }) => {
 *   // Thing
 *   // => { foo: "bar" }
 *
 *   // SecondThing
 *   // => { ThingContent: "ipsum bar", foo: "bar" }
 * })
 */
const pluginus = ({ props, nameFn = defaultNameFn } = {}) =>
  pipe(
    // Sanitize
    remove(isEmpty),
    distinct,

    // Check file exists and prepare all plugins for loading
    map(item => {
      if (!fs.existsSync(item)) {
        throw new Error(`Pluginus: file path "${item}" does not exist`)
      }

      const { default: plugin = {} } = require(item)

      return {
        name: pipe(
          basename,
          nameFn
        )(item),
        depend: is(plugin.depend) ? plugin.depend : [],
        create: is(plugin.create) ? plugin.create(props) : () => plugin,
      }
    }),

    // Sort based on dependency. Plugins without dependencies get loaded first
    sort((a, b) => (has(a.name)(b.depend) ? -1 : 1)),

    // Load all plugins
    unresolvedPlugins => {
      const loaded = {}

      const load = ({ name, depend, create }) => {
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
          dependencies => create(...map(item => item.create)(dependencies)),

          // return plugin content and name
          pluginContent => ({
            name,
            create: pluginContent,
          })
        )(depend))
      }

      return pipeP(
        map(load),
        plugins => Promise.all(plugins),
        reduce(
          (acc, item) => ({
            ...acc,
            [item.name]: item.create,
          }),
          {}
        )
      )(unresolvedPlugins)
    }
  )

export { pluginus }
