import { MigrationConfig } from "drizzle-orm/migrator";

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing key in env: '${key}'`);
  }
  return value;
}

type APIConfig = {
  fileServerHits: number;
  db: DBConfig;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

process.loadEnvFile();

export const config: APIConfig = {
  fileServerHits: 0,
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};
