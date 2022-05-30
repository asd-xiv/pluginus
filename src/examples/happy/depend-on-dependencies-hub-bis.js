export default {
  depend: ["DependOnDependenciesHub"],

  create: () => ({
    dependOn: "hub",
  }),
}
