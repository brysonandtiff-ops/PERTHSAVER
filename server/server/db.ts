import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@127.0.0.1:5432/perth_saver_dev";
const client = postgres(databaseUrl, { max: 1 });
export const db = drizzle(client);
