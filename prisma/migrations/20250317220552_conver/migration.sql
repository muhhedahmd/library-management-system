/*
  Warnings:

  - You are about to drop the column `bookId` on the `checkouts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `checkouts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "checkouts" DROP CONSTRAINT "checkouts_bookId_fkey";

-- DropIndex
DROP INDEX "checkouts_bookId_idx";

-- DropIndex
DROP INDEX "checkouts_userId_bookId_key";

-- AlterTable
ALTER TABLE "checkouts" DROP COLUMN "bookId";

-- CreateTable
CREATE TABLE "_BookToCheckout" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookToCheckout_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BookToCheckout_B_index" ON "_BookToCheckout"("B");

-- CreateIndex
CREATE UNIQUE INDEX "checkouts_userId_key" ON "checkouts"("userId");

-- AddForeignKey
ALTER TABLE "_BookToCheckout" ADD CONSTRAINT "_BookToCheckout_A_fkey" FOREIGN KEY ("A") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToCheckout" ADD CONSTRAINT "_BookToCheckout_B_fkey" FOREIGN KEY ("B") REFERENCES "checkouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
