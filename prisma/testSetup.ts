// user/prisma/testSetup.ts
import { execSync } from "node:child_process";

module.exports = async () => {
  // Use 'prisma db push' for quick schema sync, or 'prisma migrate deploy' if you have migrations
  execSync("npx prisma db push", { stdio: "inherit" });
};
