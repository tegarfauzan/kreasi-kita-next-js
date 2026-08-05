import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  },
  datasource: {
    // A fallback lets `prisma generate` run in dependency-only CI builds.
    // Database commands still fail safely until a real URL is provided.
    url: process.env.DATABASE_URL ?? "mysql://invalid:invalid@127.0.0.1:3306/invalid"
  }
});
