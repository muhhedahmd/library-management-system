/*
  Warnings:

  - Added the required column `country` to the `billingAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "billingAddress" ADD COLUMN     "country" TEXT NOT NULL;
