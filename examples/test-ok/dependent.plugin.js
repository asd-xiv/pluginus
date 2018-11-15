const { merge } = require("@asd14/m")

module.exports = {
  depend: ["Plain", "Promise"],

  create: (Plain, Promis) => merge(Plain, Promis),
}
