import glob from "glob"
import { pluginus } from "../../src/pluginus"

pluginus({
  props: {
    foo: "bar",
  },
})(glob("./plugins/*.js")).then(({ Thing, Something }) => {
  console.log({
    Thing,
    Something,
  })
})
