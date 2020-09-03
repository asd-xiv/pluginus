import { mergeAll } from "m.xyz"

export default {
  depend: ["Plain", "Plain2", "PromisePlugin"],

  create: (Plain, Plain2, Promis) => {
    return mergeAll([Plain, Promis])
  },
}
