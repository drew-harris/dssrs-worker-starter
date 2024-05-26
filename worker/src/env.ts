import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.string(),
    QUEUE_NAME: z.string(),
  },

  runtimeEnvStrict: {
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    QUEUE_NAME: process.env.QUEUE_NAME,
  },

  emptyStringAsUndefined: true,
});
