export default {
  depend: ["Plain2"],

  create: () => () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          promiseLorem: "lorem promises ipsum",
        })
      }, 50)
    }),
}
