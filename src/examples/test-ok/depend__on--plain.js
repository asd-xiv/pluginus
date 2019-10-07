import { merge } from "@mutantlove/m"

export default {
  depend: ["Plain", "Plain2", "PromisePlugin"],

  create: () => (Plain, Plain2, Promis) => {
    return merge(Plain, Promis)
  },
}
