let runs = 0

export default {
  name: "ExplicitName",

  depend: ["Object"],

  create: () => {
    runs = runs + 1

    return {
      echo: input => input,
      timesConstructorRan: () => runs,
    }
  },
}
