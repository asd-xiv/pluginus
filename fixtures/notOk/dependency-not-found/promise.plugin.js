module.exports = {
  depend: [ "WrongPluginName" ],

  create: () =>
    new Promise( resolve => {
      setTimeout( () => {
        resolve( {
          promiseLorem: "lorem promises ipsum",
        } )
      }, 50 )
    } ),
}
