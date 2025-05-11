/*
  Warnings:

  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `items` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "items" JSONB NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;
