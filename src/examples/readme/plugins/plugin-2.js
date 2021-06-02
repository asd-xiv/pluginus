/* eslint-disable unicorn/prefer-module */

module.exports = {
  depend: ["PluginOne"],

  name: "Plugin2",

  create: PluginOne => ({
    lorem: `ipsum ${PluginOne.foo}`,
  }),
}
