// user\prisma.config.ts

import { defineConfig } from "prisma/config";

export default defineConfig({
  // defaults: schema at ./prisma/schema.prisma
  migrations: {
    seed: "tsx prisma/main.ts",
  },
});
