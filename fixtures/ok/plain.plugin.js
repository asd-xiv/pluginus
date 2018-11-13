const { when, hasKey, get, raise } = require("@codemachiner/m");

module.exports = {
  depend: [],

  create: () => {
    const settings = {
      lorem: "ipsum",
      dolor: "amet"
    };

    return {
      get: key =>
        when(hasKey(key), get(key), () =>
          raise(new Error(`Key "${key}" not found`))
        )(settings)
    };
  }
};
