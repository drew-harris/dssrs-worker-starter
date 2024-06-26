import { TB_users } from "db";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { createId } from "shared";

export const createNewUser = async (db: PostgresJsDatabase) => {
  const user = await db
    .insert(TB_users)
    .values([
      {
        id: createId("user"),
        createdAt: new Date(),
      },
    ])
    .returning()
    .then((a) => a.at(0));
  if (!user) {
    throw new Error("Failed to create user");
  }
  return user;
};
