module.exports = {
  depend: [ "Plain", "Promise" ],

  create: ( Plain, Promis ) => ( {
    ...Plain,
    ...Promis,
  } ),
}
