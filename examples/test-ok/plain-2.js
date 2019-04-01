let runs = 0

export default {
  depend: ["Object"],

  create: () => () => {
    runs = runs + 1

    return {
      echo: source => source,
      timesConstructorRan: () => runs,
    }
  },
}
