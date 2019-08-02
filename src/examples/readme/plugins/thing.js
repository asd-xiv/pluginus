module.exports = {
  create: (/* seed */) => () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          foo: "bar",
        })
      }, 50)
    }),
}
