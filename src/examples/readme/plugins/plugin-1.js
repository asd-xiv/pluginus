module.exports = {
  depend: [],

  name: "PluginOne",

  create: () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          foo: "bar",
        })
      }, 50)
    })
  },
}
