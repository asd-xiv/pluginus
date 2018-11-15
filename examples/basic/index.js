const path = require("path")
const pluginus = require("../../src/pluginus")

pluginus({
  folders: path.join(__dirname, "plugins"),
}).then(({ Thing, Something }) => {
  console.log({
    Thing,
    Something,
  })
})
