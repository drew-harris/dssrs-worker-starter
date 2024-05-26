import { Worker } from "bullmq";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { JobType, PossibleJob } from "shared/types";
import { env } from "./env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool, {
  logger: true,
});

const playlistIngestWorker = new Worker<PossibleJob>(
  env.QUEUE_NAME,
  async (job) => {
    try {
      switch (job.data.type) {
        case JobType.EXAMPLE1:
          console.log("Example1 job received");
        default:
          throw new Error("Invalid job type");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  {
    prefix: process.env.NODE_ENV == "production" ? "prod" : "dev",
    connection: {
      host: env.REDIS_HOST,
      password: env.REDIS_PASSWORD,
      port: 6379,
    },
    autorun: false,
  },
);

playlistIngestWorker.run();

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, stopping worker");
  await playlistIngestWorker.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, stopping worker");
  await playlistIngestWorker.close();
  process.exit(0);
});
