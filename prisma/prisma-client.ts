import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "./generated/client";

const pool = new Pool({
  connectionString: process.env.DB_POSTGRES_URL_NON_POOLING,
});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
