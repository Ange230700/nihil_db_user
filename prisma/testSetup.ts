// user/prisma/testSetup.ts

import { execSync } from "node:child_process";

export default async function () {
  try {
    execSync("npx prisma db push", { stdio: "inherit" });
  } catch (err) {
    console.error("Error in Jest globalSetup:", err);
    throw err;
  }
}
