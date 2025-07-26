// prisma\helpers\cleanUp.ts

import prisma from "~/prisma/lib/client";
import deleteSafely from "~/prisma/helpers/deleteSafely";

async function cleanUp() {
  console.log("🧹 Cleaning up…");
  await Promise.all([
    deleteSafely(() => prisma.userprofile.deleteMany({}), "user profiles"),
    deleteSafely(() => prisma.user.deleteMany({}), "users"),
  ]);
  console.log("🧹 Cleaning up complete.");
}

cleanUp()
  .then(() => {
    console.log("🟢 cleanUp.ts: Script executed successfully.");
  })
  .catch((e) => {
    console.error("🔴 cleanUp.ts: Script failed:", e);
    process.exit(1);
  });

export default cleanUp;
