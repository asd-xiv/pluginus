/* eslint-disable no-use-before-define */

const debug = require("debug")("Pluginus:Main")
const path = require("path")
const {
  merge,
  findFiles,
  map,
  pipe,
  reduce,
  zipToObj,
  type,
  hasKey,
  raise,
} = require("@codemachiner/m")

/**
 * Capitalize first letter
 *
 * @param  {string}  string  The string
 *
 * @return {string}
 */
const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

/**
 * File name => plugin name
 *
 * @param {String}  input  File name
 *
 * @return {String}
 *
 * @example
 * defaultName( "test.plugin.js" )
 * // => Test
 */
const defaultName = pipe(
  fileName => fileName.replace(".plugin.js", ""),

  // remove special characters
  fileName => fileName.replace(/-|\./, ""),
  capitalizeFirstLetter
)

/**
 * Default plugin factory
 *
 * @param  {mixed}  pluginExport  The plugin export
 * @param  {Array}  depenpencies  The depenpencies
 *
 * @return {mixed}  Run .create function if exists in plugin export, else
 *                  export content
 */
const defaultCreate = (pluginExport, depenpencies = []) =>
  type(pluginExport.create) === "Function"
    ? pluginExport.create.call(null, ...depenpencies)
    : pluginExport

/**
 * Map plugin name to file's export
 *
 * @param  {Function}       handleName  Translate file name to plugin name
 * @param  {string[]}       filePaths   List of absolute file paths
 *
 * @return {Array<Object>}
 */
const prepare = handleName =>
  reduce((acc = Object.create(null), currentValue) => {
    const fileName = path.basename(currentValue)
    const pluginName = handleName(fileName)

    return hasKey(pluginName)(acc)
      ? raise(
          new Error(
            `Pluginus: Duplicate name error: "${pluginName}" from ${currentValue}`
          )
        )
      : merge(
          {
            [pluginName]: {
              def: require(currentValue),
              startAt: process.hrtime(),
              fileName,
            },
          },
          acc
        )
  })

/**
 * Call each plugin's factory method and wrapp it with a Promise.
 *
 * @param  {Function}         handleCreate   Plugin factory function
 * @param  {Object}           pluginExports  Object mapping the plugin name =>
 *                                           file export content
 *
 * @return {Object<Promise>}
 */
const load = handleCreate => pluginExports => {
  const loadDependencies = loadedPlugins =>
    map(depName => {
      if (!hasKey(depName)(pluginExports)) {
        raise(new Error(`Pluginus: Dependency not found: "${depName}"`))
      }

      return hasKey(depName)(loadedPlugins)
        ? loadedPlugins[depName]
        : loadOne(loadedPlugins, pluginExports[depName])
    })

  const loadOne = (loadedPlugins, { def }) =>
    type(def.depend) === "Array"
      ? Promise.all(loadDependencies(loadedPlugins)(def.depend)).then(
          resolvedDeps => handleCreate(def, resolvedDeps)
        )
      : Promise.resolve(handleCreate(def))

  return reduce(
    (acc, [name, plugin]) =>
      // plugin could be loaded as dependency
      hasKey(name)(acc)
        ? acc
        : merge(
            {
              [name]: loadOne(acc, plugin),
            },
            acc
          ),
    Object.create(null)
  )(Object.entries(pluginExports))
}

/**
 * Factory
 *
 * @param  {Object}    arg1               Props
 * @param  {string}    arg1.root          Recursivly scan folder
 * @param  {RegExp}    arg1.fileMatch     Load files that match
 * @param  {Function}  arg1.handleCreate  Plugin factory method
 * @param  {Function}  arg1.handleName    Translate file name to plugin name
 *
 * @return {Object}
 */
module.exports = ({
  root,
  fileMatch = /.*\.plugin\.js/,
  handleCreate = defaultCreate,
  handleName = defaultName,
}) =>
  pipe(
    findFiles({ test: fileMatch }),
    prepare(handleName),
    load(handleCreate),
    pluginMap =>
      Promise.all(Object.values(pluginMap)).then(
        zipToObj(Object.keys(pluginMap))
      )
  )(root)
