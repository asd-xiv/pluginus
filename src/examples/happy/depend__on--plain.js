/* eslint-disable unicorn/filename-case */

export default {
  depend: ["Plain", "ExplicitName", "PromisePlugin"],

  create: (Plain, ExplicitName, PromisePlugin) => {
    return {
      lorem: Plain.get("lorem"),
      foo: ExplicitName.echo("bar"),
      ping: PromisePlugin.ping,
    }
  },
}
