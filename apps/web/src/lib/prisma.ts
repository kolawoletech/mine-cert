import { PrismaClient } from "@minecert/database/client";

const prismaGlobal = globalThis as typeof globalThis & {
  minecertPrisma?: PrismaClient;
};

export const prisma =
  prismaGlobal.minecertPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.minecertPrisma = prisma;
}
