// prisma/main.ts

import prisma from "~/prisma/lib/client";
import seedUsers from "~/prisma/user/seed";

async function main() {
  console.log("🌱 Seeding...");

  const skipCleanup = process.env.SKIP_CLEANUP === "true";

  await seedUsers(skipCleanup);

  console.log("🌱 Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
