// import '@/envConfig'
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is missing");
}
console.log(process.env.POSTGRES_URL);

const pool = postgres(process.env.POSTGRES_URL, { max: 1 });

export const db = drizzle(pool, { schema });