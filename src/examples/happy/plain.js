export default {
  create: () => {
    const settings = {
      lorem: "ipsum",
      dolor: "amet",
    }

    return {
      get: key => settings[key],
    }
  },
}
