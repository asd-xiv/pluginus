const debug = require( "debug" )( "Pluginus:DependentPlugin" )

module.exports = {
  depend: [ "Plain", "Promise" ],

  create: ( Plain, Promis ) => ( {
    dependLorem: {
      ...Plain,
      ...Promis,
    },
  } ),
}
