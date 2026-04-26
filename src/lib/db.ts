import postgres from "postgres";

declare global {
  var __pbpSql: ReturnType<typeof postgres> | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  return databaseUrl;
}

export function getSql() {
  if (!globalThis.__pbpSql) {
    globalThis.__pbpSql = postgres(getDatabaseUrl(), {
      max: 1,
      prepare: false,
    });
  }

  return globalThis.__pbpSql;
}
