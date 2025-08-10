import { PrismaClient } from "@prisma/client";
type UserSeedClient = Pick<PrismaClient, "user" | "userprofile">;
export declare const NUM_USERS = 10;
declare function seedUsers(prismaClient?: UserSeedClient, skipCleanup?: boolean): Promise<void>;
export default seedUsers;
