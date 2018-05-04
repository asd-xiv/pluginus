module.exports = {
  depend: [ "Plain", "Promise" ],

  create: ( Plain, Promis ) => ( {
    dependLorem: {
      ...Plain,
      ...Promis,
    },
  } ),
}
