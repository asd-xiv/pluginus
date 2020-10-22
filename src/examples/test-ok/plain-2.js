let runs = 0

module.exports = {
  name: "ExplicitName",

  depend: ["Object"],

  create: () => {
    runs = runs + 1

    return {
      echo: source => source,
      timesConstructorRan: () => runs,
    }
  },
}
