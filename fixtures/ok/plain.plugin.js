const debug = require( "debug" )( "Pluginus:PlainPlugin" )

module.exports = {
  depend: [],

  create: () => ( {
    plainLorem: "lorem ipsum",
  } ),
}
