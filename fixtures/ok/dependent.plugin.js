const { merge } = require("@codemachiner/m");

module.exports = {
  depend: ["Plain", "Promise"],

  create: (Plain, Promis) => merge(Plain, Promis)
};
