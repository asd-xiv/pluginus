import glob from "glob"
import { pluginus } from "../../pluginus"

pluginus({
  pathArray: glob("./plugins/*.js"),
}).then(({ Thing, Something }) => {
  console.log({
    Thing,
    Something,
  })
})
