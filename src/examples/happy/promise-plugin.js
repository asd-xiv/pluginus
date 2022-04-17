export default {
  depend: ["ExplicitName"],

  create: () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ping: "pong",
        })
      }, 50)
    }),
}
