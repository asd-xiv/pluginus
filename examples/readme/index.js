import path from "path"
import { pluginus } from "../../src/pluginus"

pluginus({
  props: {
    foo: "bar",
  },
})([
  path.resolve("./plugins/thing.js"),
  path.resolve("./plugins/second-thing.js"),
]).then(({ Thing, Something }) => {
  console.log({
    Thing,
    Something,
  })
})
