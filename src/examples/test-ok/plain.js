import { when, hasKey, get, raise } from "@mutantlove/m"

export default {
  create: props => () => {
    const settings = {
      lorem: "ipsum",
      dolor: "amet",
      ...props,
    }

    return {
      get: key =>
        when(hasKey(key), get(key), () =>
          raise(new Error(`Key "${key}" not found`))
        )(settings),
    }
  },
}
