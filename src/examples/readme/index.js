import glob from "glob"
import { pluginus } from "../../pluginus"

pluginus({
  pathArray: glob("./plugins/*.js"),
}).then(({ PluginOne, Plugin2 }) => {
  console.log({
    PluginOne,
    Plugin2,
  })
})
