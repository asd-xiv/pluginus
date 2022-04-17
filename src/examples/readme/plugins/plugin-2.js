export default {
  depend: ["PluginOne"],

  name: "Plugin2",

  create: PluginOne => ({
    lorem: `ipsum ${PluginOne.foo}`,
  }),
}
