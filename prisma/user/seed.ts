// user\prisma\user\seed.ts

import argon2 from "argon2";
import prisma from "~/prisma/lib/client";
import { faker } from "@faker-js/faker";
import deleteSafely from "~/prisma/helpers/deleteSafely";

export const NUM_USERS = 10;

async function seedUsers(skipCleanup = false) {
  if (!skipCleanup) {
    await deleteSafely(
      () => prisma.userprofile.deleteMany({}),
      "user profiles",
    );
    await deleteSafely(() => prisma.user.deleteMany({}), "users");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  const fakeUsers = await Promise.all(
    Array.from({ length: NUM_USERS }).map(async () => {
      const password = await argon2.hash("password");
      return {
        username:
          faker.internet.username().toLowerCase() +
          faker.number.int({ min: 100, max: 999 }),
        email: faker.internet.email().toLowerCase(),
        passwordHash: password,
        displayName: faker.person.fullName(),
        avatarUrl: faker.image.avatar(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
        profile: {
          create: {
            bio: faker.lorem.sentence(),
            location: faker.location.city(),
            birthdate: faker.date.birthdate({
              min: 1980,
              max: 2005,
              mode: "year",
            }),
            website: faker.internet.url(),
            updatedAt: new Date(),
          },
        },
      };
    }),
  );

  await Promise.all(
    fakeUsers.map((user) => prisma.user.create({ data: user })),
  );

  console.log(`🌟 Created ${NUM_USERS} users.`);
}

export default seedUsers;
