// user\prisma\main.ts

import { runSeed } from "@nihil/shared";
import prisma from "@nihil/user/prisma/lib/client";
import seedUsers from "@nihil/user/prisma/seed";

const seedWithClient = (skipCleanup: boolean) => seedUsers(prisma, skipCleanup);

async function main() {
  runSeed(seedWithClient, "User seeding");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
