// user\prisma\lib\client.ts

import { PrismaClient } from "nihildbuser/prisma/generated/client";

const prisma = new PrismaClient();

export default prisma;
export * from "nihildbuser/prisma/generated/client";
