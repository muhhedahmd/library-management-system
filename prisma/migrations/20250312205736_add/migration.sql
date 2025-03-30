/*
  Warnings:

  - Added the required column `type` to the `bookCover` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "bookcoverType" AS ENUM ('THUMBNAIL', 'Image');

-- AlterTable
ALTER TABLE "bookCover" ADD COLUMN     "type" "bookcoverType" NOT NULL;
