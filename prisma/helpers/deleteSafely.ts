// user\prisma\helpers\deleteSafely.ts

import { Prisma } from "@prisma/client";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function deleteSafely(fn: () => Promise<unknown>, name: string) {
  const MAX_TRIES = 6;
  const BASE_DELAY_MS = 100;
  let tries = 0;
  while (true) {
    try {
      await fn();
      console.log(`✅ Deleted ${name}`);
      return;
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        tries < MAX_TRIES
      ) {
        tries++;
        const delay = BASE_DELAY_MS * Math.pow(2, tries);
        console.log(
          `⚠️ Retrying to delete ${name} in ${delay}ms...(try ${tries}/${MAX_TRIES})`,
        );
        await sleep(delay);
        continue;
      }

      throw e;
    }
  }
}

export default deleteSafely;
