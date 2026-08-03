import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

async function getRuntimeEnv() {
  const moduleName = "cloudflare:" + "workers";
  const runtime = await import(moduleName);
  return runtime.env;
}

export async function getD1() {
  const env = await getRuntimeEnv();
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }
  return env.DB;
}

export async function getDb() {
  return drizzle(await getD1(), { schema });
}
