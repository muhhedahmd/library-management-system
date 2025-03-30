/*
  Warnings:

  - Added the required column `totalPrice` to the `checkouts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "checkouts" ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "purchase" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
