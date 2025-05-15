/*
  Warnings:

  - You are about to drop the column `phoneVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phoneVerified",
ADD COLUMN     "verified" TIMESTAMP(3);
