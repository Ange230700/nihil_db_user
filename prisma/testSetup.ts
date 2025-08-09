// user/prisma/testSetup.ts

import { execSync } from "node:child_process";

export default async function () {
  for (let i = 0; i < 10; i++) {
    try {
      execSync("npx prisma db push", { stdio: "inherit" });
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}
