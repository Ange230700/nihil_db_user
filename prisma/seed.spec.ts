// user\prisma\seed.spec.ts

import prisma from "@nihil/user/prisma/lib/client";
import seedUsers, { NUM_USERS } from "@nihil/user/prisma/seed";

describe("User Seeding (isolated)", () => {
  it("should seed users with profiles inside a transaction and rollback", async () => {
    try {
      await prisma.$transaction(
        async (tx) => {
          await seedUsers(tx, false);
          const users = await tx.user.findMany({ include: { profile: true } });
          expect(users.length).toBe(NUM_USERS);
          expect(users.every((u) => u.profile)).toBe(true);

          // Force rollback by throwing
          throw new Error("Force rollback for test isolation");
        },
        { timeout: 20_000 },
      ); // Increase timeout for transaction
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message !== "Force rollback for test isolation"
      ) {
        throw err;
      }
    }
  }, 25_000);

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
