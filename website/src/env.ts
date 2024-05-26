import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.string(),
  },

  runtimeEnvStrict: {
    DATABASE_URL: process.env["DATABASE_URL"],
    REDIS_PASSWORD: process.env["REDIS_PASSWORD"],
    REDIS_HOST: process.env["REDIS_HOST"],
  },

  emptyStringAsUndefined: true,
});
