// user\prisma\main.ts

import { runSeed } from "nihildbshared";
import prisma from "nihildbuser/prisma/lib/client";
import seedUsers from "nihildbuser/prisma/seed";

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
    prisma.$disconnect();
  });
