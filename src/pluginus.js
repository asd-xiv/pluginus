/* eslint-disable no-use-before-define,no-sync */

const path = require("path")
const fs = require("fs")
const {
  distinct,
  filter,
  findFiles,
  hasKey,
  isEmpty,
  map,
  merge,
  pipe,
  raise,
  reduce,
  remove,
  type,
  when,
  zipToObj,
} = require("@asd14/m")

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
 * @param  {mixed}  seed          Data passed to plugin factory function
 * @param  {mixed}  pluginExport  The plugin export
 * @param  {Array}  depenpencies  The depenpencies
 *
 * @return {mixed}  Run .create function if exists in plugin export, else
 *                  export content
 */
const handlePluginCreate = (seed = {}) => (pluginExport, depenpencies = []) =>
  type(pluginExport.create) === "Function"
    ? pluginExport.create.call(null, seed).call(null, ...depenpencies)
    : pluginExport

/**
 * Map plugin name to whats inside the file
 *
 * @param  {Function}       handleName  Translate file name to plugin name
 * @param  {string[]}       filePaths   List of absolute file paths
 *
 * @return {Object}
 */
const build = handleName =>
  reduce((acc, filePath) => {
    const fileName = path.basename(filePath)
    const pluginName = handleName(fileName)

    return hasKey(pluginName)(acc)
      ? raise(
          new Error(
            `Pluginus: Duplicate name error: "${pluginName}" from ${filePath}`
          )
        )
      : {
          ...acc,
          [pluginName]: {
            pluginExport: require(filePath),
            startAt: process.hrtime(),
            fileName,
          },
        }
  }, Object.create(null))

/**
 * Call each plugin's factory method and wrapp it with a Promise.
 *
 * @param  {Function}         seed  Plugin factory function
 * @param  {Object}           pluginsExport       Object mapping the plugin
 *                                                name => file export content
 *
 * @return {Object<Promise>}
 */
const create = seed => pluginsExport => {
  const loadDependencies = pluginsLoaded =>
    map(depName => {
      if (!hasKey(depName)(pluginsExport)) {
        raise(new Error(`Pluginus: Dependency not found: "${depName}"`))
      }

      return hasKey(depName)(pluginsLoaded)
        ? pluginsLoaded[depName]
        : loadOne(pluginsLoaded, pluginsExport[depName])
    })

  const loadOne = (pluginsLoaded, { pluginExport }) =>
    type(pluginExport.depend) === "Array"
      ? Promise.all(loadDependencies(pluginsLoaded)(pluginExport.depend)).then(
          resolvedDeps => handlePluginCreate(seed)(pluginExport, resolvedDeps)
        )
      : Promise.resolve(handlePluginCreate(seed)(pluginExport))

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
  )(Object.entries(pluginsExport))
}

const not = fn => source => !fn.call(null, source)

/**
 * Check folders is not empty and exist
 *
 * @param  {string|string[]}  folders  The folders
 *
 * @return {undefined}
 */
const checkFolders = when(
  isEmpty,
  folders => {
    throw new Error(
      `Pluginus: "folders" parameter must be a non empty string or array of strings. Got ${folders} of type ${type(
        folders
      )}`
    )
  },
  pipe(
    filter(folder => !fs.existsSync(path.resolve(folder))),
    when(not(isEmpty), paths => {
      throw new Error(
        `Pluginus: the following "folder" paths do not exist: ${paths}`
      )
    })
  )
)

/**
 * Check files exists
 *
 * @param {string[]}  files  List of file paths
 *
 * @return {string[]}
 */
const checkFiles = when(
  pipe(
    filter(file => !fs.existsSync(path.resolve(file))),
    not(isEmpty)
  ),
  paths => {
    throw new Error(
      `Pluginus: the following "file" paths do not exist: ${paths}`
    )
  }
)

/**
 * Scan folder(s), find all file names matching a name or regExp and run each
 * file's create function
 *
 * @param  {Object}                arg1          Props
 * @param  {string|string[]}       arg1.folders  Recursivly scan folders
 * @param  {Array<string|RegExp>}  arg1.files    Load files that match
 * @param  {Function}              arg1.name     Translate file name to plugin
 *                                               name
 *
 * @return {Promise}
 */
module.exports = ({
  folders,
  files = [/.*\.plugin\.js/],
  name = defaultName,
  seed = {},
} = {}) => {
  // All folders must exist
  checkFolders(folders)

  return pipe(
    // Scan all folders with given regular expressions
    reduce((acc = [], file) => [
      ...acc,
      ...(type(file) === "RegExp" ? findFiles(file)(folders) : [file]),
    ]),

    // Sanitize
    distinct,
    remove(undefined, null),

    // All files must exist
    checkFiles,

    // Map plugin name to whats inside the file
    build(name),

    // Initialize each plugin
    create(seed),

    pluginMap =>
      Promise.all(Object.values(pluginMap)).then(
        zipToObj(Object.keys(pluginMap))
      )
  )(files)
}
