// user\prisma\main.ts

import { runSeed } from "nihildbshared";
import prisma from "nihildbuser/prisma/lib/client";
import seedUsers from "nihildbuser/prisma/seed";

async function main() {
  runSeed(seedUsers, "User seeding");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
