-- CreateTable
CREATE TABLE "billingAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "CheckoutId" TEXT,

    CONSTRAINT "billingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkouts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "checkoutDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),

    CONSTRAINT "checkouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "billingAddress_CheckoutId_key" ON "billingAddress"("CheckoutId");

-- CreateIndex
CREATE INDEX "checkouts_userId_idx" ON "checkouts"("userId");

-- CreateIndex
CREATE INDEX "checkouts_bookId_idx" ON "checkouts"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "checkouts_userId_bookId_key" ON "checkouts"("userId", "bookId");

-- AddForeignKey
ALTER TABLE "billingAddress" ADD CONSTRAINT "billingAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billingAddress" ADD CONSTRAINT "billingAddress_CheckoutId_fkey" FOREIGN KEY ("CheckoutId") REFERENCES "checkouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
