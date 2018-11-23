const { when, hasKey, get, raise } = require("@asd14/m")

module.exports = {
  create: seed => () => {
    const settings = {
      lorem: "ipsum",
      dolor: "amet",
      ...seed,
    }

    return {
      get: key =>
        when(hasKey(key), get(key), () =>
          raise(new Error(`Key "${key}" not found`))
        )(settings),
    }
  },
}
