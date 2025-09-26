import { PrismaClient } from "@/generated/prisma";

const globalPrismaThis = globalThis as unknown as {
  prisma: PrismaClient;
};

export const prisma = globalPrismaThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalPrismaThis.prisma = prisma;
}
