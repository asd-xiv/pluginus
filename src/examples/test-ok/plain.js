import { when, hasKey, get, raise } from "@mutant-ws/m"

export default {
  create: () => {
    const settings = {
      lorem: "ipsum",
      dolor: "amet",
    }

    return {
      get: key =>
        when(hasKey(key), get(key), () =>
          raise(new Error(`Key "${key}" not found`))
        )(settings),
    }
  },
}
