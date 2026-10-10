import type { z } from "zod";
import type { __domainCamel__Schema } from "./schemas";

export type __Domain__ = z.infer<typeof __domainCamel__Schema>;
