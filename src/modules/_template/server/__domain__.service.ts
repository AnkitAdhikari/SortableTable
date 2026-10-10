import type { __Domain__ } from "../model/types";
import { __domainCamel__Repository } from "./__domain__.repository";

export const __domainCamel__Service = {
  async list(): Promise<__Domain__[]> {
    return __domainCamel__Repository.findMany();
  },
};
