/*
  Warnings:

  - You are about to drop the `_BookToCheckout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BookToCheckout" DROP CONSTRAINT "_BookToCheckout_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToCheckout" DROP CONSTRAINT "_BookToCheckout_B_fkey";

-- DropForeignKey
ALTER TABLE "purchase" DROP CONSTRAINT "purchase_bookId_fkey";

-- DropForeignKey
ALTER TABLE "purchase" DROP CONSTRAINT "purchase_userId_fkey";

-- DropTable
DROP TABLE "_BookToCheckout";

-- DropTable
DROP TABLE "purchase";

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "checkoutId" TEXT NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "purchases_userId_purchaseDate_idx" ON "purchases"("userId", "purchaseDate");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
