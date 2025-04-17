/*
  Warnings:

  - You are about to drop the column `tagsTest` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CartItemToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CartItemToTag" DROP CONSTRAINT "_CartItemToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartItemToTag" DROP CONSTRAINT "_CartItemToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToTag" DROP CONSTRAINT "_ProductToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToTag" DROP CONSTRAINT "_ProductToTag_B_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "tagsTest",
ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_CartItemToTag";

-- DropTable
DROP TABLE "_ProductToTag";
