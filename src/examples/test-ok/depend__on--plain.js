import { mergeAll } from "@asd14/m"

export default {
  depend: ["Plain", "ExplicitName", "PromisePlugin"],

  create: (Plain, ExplicitName, Promis) => {
    return mergeAll([Plain, Promis])
  },
}
