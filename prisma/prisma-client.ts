import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_POSTGRES_URL_NON_POOLING,
});
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
