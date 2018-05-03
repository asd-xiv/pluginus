const test = require( "blue-tape" )
const path = require( "path" )

const { createSet } = require( "./pluginus" )

test( "Defaults", async t => {
  t.equals(
    typeof createSet, "function",
    ".createSet factory function exists" )

  const plugins = await createSet( {
    root: path.resolve( "fixtures/ok" ),
  } )

  t.equals(
    Object.entries( plugins ).length, 3,
    "All plugins loaded" )

  t.deepEquals(
    plugins.Plain,
    { plainLorem: "lorem ipsum" },
    "PlainPlugin should return object (sync)" )

  t.deepEquals(
    plugins.Promise,
    { promiseLorem: "lorem promises ipsum" },
    "PromisePlugin should return promise (async)" )

  t.deepEquals(
    plugins.Dependent, {
      dependLorem: {
        plainLorem  : "lorem ipsum",
        promiseLorem: "lorem promises ipsum",
      },
    },
    "DependentPlugin with dependencies should return object" )
} )

test( "Custom nameFn and match RegExp", async t => {
  const pluginSet = await createSet( {
    root  : path.resolve( "fixtures/ok" ),
    match : /plain\.plugin\.js/,
    nameFn: fileName =>
      fileName
        .replace( ".plugin.js", "" )
        .toUpperCase(),
  } )

  t.equals(
    Object.entries( pluginSet ).length, 1,
    "All plugins loaded based on custom \"match\" reg exp" )

  t.equals(
    typeof pluginSet.PLAIN, "object",
    "Plugin loaded with custom \"name\" function" )
} )
