module.exports = {
  depend: ["Thing"],

  // First "Thing" is resolved to { foo: "bar" } and then continue with create
  create: Thing => ({
    loremPlugin: `ipsum ${Thing.foo}`,
  }),
}
