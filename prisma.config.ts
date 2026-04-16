import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { defineConfig, env } from "prisma/config";

type Env = {
  DIRECT_URL: string;
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Use the session pooler (port 5432, IPv4) for DDL/migrations.
  // App runtime uses DATABASE_URL via the PrismaPg adapter in lib/prisma.ts.
  datasource: {
    url: env<Env>("DIRECT_URL"),
  },
});
