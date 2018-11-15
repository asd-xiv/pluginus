module.exports = {
  depend: ["Plain2"],

  create: () => ({
    echo: source => source,
  }),
}
