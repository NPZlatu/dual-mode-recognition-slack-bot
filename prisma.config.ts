import { defineConfig } from "prisma/config";
import { DB_URL } from "./src/constants/index.js";

export default defineConfig({
  schema: "src/db/schema.prisma",
  migrations: {
    path: "src/db/migrations",
  },
  engine: "classic",
  datasource: {
    url: DB_URL,
  },
});
