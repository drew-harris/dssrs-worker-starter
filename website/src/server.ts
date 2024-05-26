import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { appRouter } from "./trpc/app";
import { handlePage } from "./internal/serverPageHandler";
import { Queue } from "bullmq";
import postgres from "postgres";
import { Hono } from "hono";
import { PossibleJob } from "shared/types";
import { drizzle } from "drizzle-orm/postgres-js";
import { createAuth } from "./auth";
import { env } from "./env";
import { authMiddleware } from "./auth/middleware";
import { TRPCContext } from "./trpc/base";

const server = new Hono();

const queryClient = postgres(env.DATABASE_URL);
const db = drizzle(queryClient);
const auth = createAuth(db);
const ingestQueue = new Queue<PossibleJob>("CHANGEME_QUEUE_NAME", {
  prefix: import.meta.env.PROD ? "prod" : "dev",
  connection: {
    host: env.REDIS_HOST,
    password: env.REDIS_PASSWORD,
    port: 6379,
  },
});

server.use("/assets/*", serveStatic({ root: "./dist/public" }));
server.use("/favicon.ico", serveStatic({ path: "./dist/public/favicon.ico" }));

server.use("*", async (c, next) => {
  c.set("db", db);
  c.set("auth", auth);
  c.set("queue", ingestQueue);
  await next();
});

server.use("*", authMiddleware);

server.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext(_opts, c) {
      return {
        db,
        auth,
        queue: ingestQueue,
        user: c.var["user"],
        baseRequest: c,
      } satisfies TRPCContext;
    },
  }),
);

// Free to use this hono server for whatever you want (redirect urls, etc)

server.get("*", handlePage);

if (import.meta.env.PROD) {
  const port = Number(process.env["PORT"] || 3000);
  serve(
    {
      port,
      fetch: server.fetch,
    },
    () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    },
  );
}

export default server;
