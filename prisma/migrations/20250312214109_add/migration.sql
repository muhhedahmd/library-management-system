/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,bookId]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "authors" ADD COLUMN     "popularity" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "popularity" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalFavorites" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRatings" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "ratings" ADD COLUMN     "review" TEXT;

-- CreateTable
CREATE TABLE "reading_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "pagesRead" INTEGER NOT NULL DEFAULT 0,
    "readingTimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "abandonedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "authorId" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "interacted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reading_history_userId_lastReadAt_idx" ON "reading_history"("userId", "lastReadAt");

-- CreateIndex
CREATE UNIQUE INDEX "reading_history_userId_bookId_key" ON "reading_history"("userId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_categoryId_authorId_key" ON "user_preferences"("userId", "categoryId", "authorId");

-- CreateIndex
CREATE INDEX "recommendation_logs_userId_createdAt_idx" ON "recommendation_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

-- CreateIndex
CREATE INDEX "favorites_bookId_idx" ON "favorites"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_bookId_key" ON "favorites"("userId", "bookId");

-- CreateIndex
CREATE INDEX "loans_userId_idx" ON "loans"("userId");

-- CreateIndex
CREATE INDEX "loans_bookId_idx" ON "loans"("bookId");

-- CreateIndex
CREATE INDEX "ratings_bookId_rating_idx" ON "ratings"("bookId", "rating");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_userId_bookId_key" ON "ratings"("userId", "bookId");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_logs" ADD CONSTRAINT "recommendation_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_logs" ADD CONSTRAINT "recommendation_logs_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
