/* eslint-disable no-use-before-define */

const debug = require( "debug" )( "Pluginus" )
const path = require( "path" )
const { map, pipe, reduce, zipToObj, hasKey } = require( "@codemachiner/m" )
const { find } = require( "@codemachiner/m/src/fs" )

// export
const raise = error => {throw error}

/**
 * Custom package error
 */
class PluginusError extends Error {
  constructor ( message ) {
    super( message )
    this.name = "PluginusError"
  }
}

/**
 * Capitalize first letter
 *
 * @param  {string}  string  The string
 *
 * @return {string}
 */
const capitalizeFirstLetter = string =>
  string.charAt( 0 ).toUpperCase() + string.slice( 1 )

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
  fileName => fileName.replace( ".plugin.js", "" ),

  // remove special characters
  fileName => fileName.replace( /-|\./, "" ),
  capitalizeFirstLetter,
)

/**
 * { lambda_description }
 *
 * @param  {Object}    arg1         The argument 1
 * @param  {Function}  arg1.nameFn  The name function
 *
 * @return {Array<Object>}
 */
const prepare = ( { nameFn } ) => reduce( ( acc, currentValue ) => {
  const fileName = path.basename( currentValue )
  const pluginName = nameFn( fileName )

  return hasKey( pluginName )( acc )
    ? raise( new PluginusError( `Duplicate name error: "${pluginName}" from ${currentValue}` ) )
    : {
      [ pluginName ]: {
        def    : require( currentValue ),
        startAt: process.hrtime(),
        fileName,
      },
      ...acc,
    }
}, Object.create( null ) )

/**
 * Call each plugin's factory method and wrapp it with a Promise.
 *
 * @param  {Object}           pluginMap  Object mapping the plugin name => file
 *                                       export
 *
 * @return {Object<Promise>}  Map object with Promises that resovlve to the
 *                            plugin content
 */
const load = pluginMap => {

  const loadDependencies = loadedPlugins =>
    map( depName => {
      if ( !hasKey( depName )( pluginMap ) ) {
        raise( new PluginusError( `Dependency not found: "${depName}"` ) )
      }

      return hasKey( depName )( loadedPlugins )
        ? loadedPlugins[ depName ]
        : loadOne( loadedPlugins, pluginMap[ depName ] )
    } )

  const loadOne = ( loadedPlugins, { def:{ depend, create } } ) => Promise
    .all(
      loadDependencies( loadedPlugins )( depend )
    )
    .then( resolvedDeps =>
      create.call( null, ...resolvedDeps ) )

  return reduce( ( acc, [ name, plugin ] ) =>

    // plugin could be loaded as dependency
    hasKey( name )( acc )
      ? acc
      : {
        [ name ]: loadOne( acc, plugin ),
        ...acc,
      }, Object.create( null )
  )( Object.entries( pluginMap ) )
}

/**
 * Factory for creating map objects
 *
 * @param  {Object}    arg1         Props
 * @param  {Function}  arg1.nameFn  Translate file name to
 * @param  {RegExp}    arg1.match   The match
 * @param  {string}    arg1.root    The root
 *
 * @return {Object}    { description_of_the_return_value }
 */
module.exports.createSet = ( {
  nameFn = defaultName,
  match = /.*\.plugin\.js/,
  root,
} ) => pipe(
  find( { test: match } ),
  prepare( { nameFn } ),
  load,
  pluginMap => Promise
    .all( Object.values( pluginMap ) )
    .then( zipToObj( Object.keys( pluginMap ) ) ),
)( root )
