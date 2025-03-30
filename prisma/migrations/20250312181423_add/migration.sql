/*
  Warnings:

  - The `width` column on the `bookCover` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `height` column on the `bookCover` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "bookCover" DROP COLUMN "width",
ADD COLUMN     "width" INTEGER,
DROP COLUMN "height",
ADD COLUMN     "height" INTEGER;
