// user\prisma\user\seed.spec.ts

import prisma from "~/prisma/lib/client";
import seedUsers, { NUM_USERS } from "~/prisma/user/seed";
import cleanUp from "~/prisma/helpers/cleanUp";

describe("User Seeding & Cleanup", () => {
  beforeAll(async () => {
    await cleanUp(); // Clean up before
  });

  afterAll(async () => {
    await cleanUp(); // Clean up after
    await prisma.$disconnect();
  });

  it("should seed 10 users with profiles", async () => {
    await seedUsers(false);

    const userCount = await prisma.user.count();
    expect(userCount).toBe(NUM_USERS);

    const users = await prisma.user.findMany({
      include: { profile: true },
    });

    // Each user should have a profile
    users.forEach((user) => {
      expect(user.profile).toBeDefined();
      expect(user.profile?.userId).toBe(user.id);
    });

    // Sanity: check a field
    expect(users[0].username).toBeTruthy();
    expect(users[0].email).toMatch(/@/);
    expect(users[0].profile?.bio).toBeTruthy();
  });

  it("should cleanup all users and profiles", async () => {
    await cleanUp();

    const userCount = await prisma.user.count();
    const profileCount = await prisma.userprofile.count();

    expect(userCount).toBe(0);
    expect(profileCount).toBe(0);
  });
});
