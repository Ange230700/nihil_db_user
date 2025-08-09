// user\prisma\seed.ts

import argon2 from "argon2";
import { faker as baseFaker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import prisma from "nihildbuser/prisma/lib/client";
import { deleteSafely } from "nihildbshared";

const SEED = process.env.SEED ?? "nihil-user-seed";
export const COUNT = Number(process.env.NUM_USERS ?? 10);
const BATCH = Number(process.env.SEED_BATCH ?? 500);
const EXPORT_IDS = process.env.EXPORT_USER_IDS === "true";
const EXPORT_PATH =
  process.env.USER_IDS_PATH ??
  path.resolve(process.cwd(), "prisma/user_ids.json");

const faker = baseFaker;
faker.seed(Array.from(SEED).reduce((acc, ch) => acc + ch.charCodeAt(0), 0));

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function seedUsers(skipCleanup = false) {
  console.time("user:seed");
  if (!skipCleanup) {
    await deleteSafely(
      () => prisma.userprofile.deleteMany({}),
      "user profiles",
    );
    await deleteSafely(() => prisma.user.deleteMany({}), "users");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  const passwordHash = await argon2.hash(faker.internet.password());
  const now = new Date();

  const users = Array.from({ length: COUNT }).map(() => {
    const id = randomUUID();
    const usernameBase = faker.internet.username().toLowerCase();
    const username = `${usernameBase}${faker.number.int({ min: 100, max: 999 })}`;
    return {
      id,
      username,
      email: faker.internet.email().toLowerCase(),
      passwordHash,
      displayName: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
      createdAt: faker.date.past(),
      updatedAt: now,
    };
  });

  const profiles = users.map((u) => ({
    id: randomUUID(),
    userId: u.id,
    bio: faker.lorem.sentence(),
    location: faker.location.city(),
    birthdate: faker.date.birthdate({ min: 1980, max: 2005, mode: "year" }),
    website: faker.internet.url(),
    updatedAt: now,
  }));

  // Bulk insert in batches with skipDuplicates (idempotent)
  for (const group of chunk(users, BATCH)) {
    await prisma.user.createMany({ data: group, skipDuplicates: true });
  }
  for (const group of chunk(profiles, BATCH)) {
    await prisma.userprofile.createMany({ data: group, skipDuplicates: true });
  }

  if (EXPORT_IDS) {
    fs.mkdirSync(path.dirname(EXPORT_PATH), { recursive: true });
    fs.writeFileSync(
      EXPORT_PATH,
      JSON.stringify(
        users.map((u) => u.id),
        null,
        2,
      ),
    );
    console.log(`🗂  Exported ${users.length} user ids → ${EXPORT_PATH}`);
  }

  console.log(`🌟 Created/ensured ${users.length} users (+ profiles).`);
  console.timeEnd("user:seed");
}

export default async function seed(skipCleanup = false) {
  await seedUsers(skipCleanup);
}
