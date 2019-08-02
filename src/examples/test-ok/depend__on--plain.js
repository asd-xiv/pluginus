import { merge } from "@asd14/m"

export default {
  depend: ["Plain", "Plain2", "PromisePlugin"],

  create: () => (Plain, Plain2, Promis) => {
    return merge(Plain, Promis)
  },
}
