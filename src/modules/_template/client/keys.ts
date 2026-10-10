export const __domainCamel__Keys = {
  all: ["__domain__"] as const,
  lists: () => [...__domainCamel__Keys.all, "list"] as const,
  list: () => [...__domainCamel__Keys.lists()] as const,
};
