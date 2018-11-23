module.exports = {
  depend: ["Plain"],

  create: () => () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          promiseLorem: "lorem promises ipsum",
        })
      }, 50)
    }),
}
