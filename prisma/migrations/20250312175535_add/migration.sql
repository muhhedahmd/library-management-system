/*
  Warnings:

  - You are about to drop the column `blurHash` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `books` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_authorId_fkey";

-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_publisherId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_bookId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "loans" DROP CONSTRAINT "loans_bookId_fkey";

-- DropForeignKey
ALTER TABLE "loans" DROP CONSTRAINT "loans_userId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_bookId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_userId_fkey";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "blurHash",
DROP COLUMN "thumbnailUrl";

-- CreateTable
CREATE TABLE "bookCover" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "name" TEXT DEFAULT 'Book cover',
    "fileSize" TEXT,
    "width" TEXT,
    "height" TEXT,
    "fileFormat" TEXT NOT NULL DEFAULT 'PDF',
    "key" TEXT,
    "fileHash" TEXT,
    "thumbnailUrl" TEXT NOT NULL,
    "blurHash" TEXT,
    "bookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookCover_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookCover" ADD CONSTRAINT "bookCover_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
