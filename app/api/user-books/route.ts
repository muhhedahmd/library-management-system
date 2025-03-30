import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all reading history records
    const readingHistories = await prisma.readingHistory.findMany({
      include: {
        book: true,
        user: {
          include: {
            billingAddress: {
              take: 1, // Get one billing address if available
            },
          },
        },
      },
    })

    const inconsistencies = []
    const fixed = []

    // Check each reading history for a corresponding purchase
    for (const history of readingHistories) {
      const purchase = await prisma.purchase.findFirst({
        where: {
          userId: history.userId,
          bookId: history.bookId,
        },
      })

      // If no purchase exists, we need to create one
      if (!purchase) {
        inconsistencies.push({
          userId: history.userId,
          bookId: history.bookId,
          bookTitle: history.book.title,
          readingHistoryId: history.id,
        })

        try {
          // Get or create a billing address for the user
          let billingAddressId

          if (history.user.billingAddress && history.user.billingAddress.length > 0) {
            billingAddressId = history.user.billingAddress[0].id
          } else {
            // Create a default billing address if none exists
            const newBillingAddress = await prisma.billingAddress.create({
              data: {
                userId: history.userId,
                street: "Default Street",
                city: "Default City",
                state: "Default State",
                postalCode: "00000",
                country: "Default Country",
              },
            })
            billingAddressId = newBillingAddress.id
          }

          // Create a checkout
          const checkout = await prisma.checkout.create({
            data: {
              userId: history.userId,
              checkoutDate: history.startedAt || new Date(),
              totalPrice: history.book.price || 0,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              address: {
                connect: {
                  id: billingAddressId,
                },
              },
            },
          })

          // Create a purchase record
          const newPurchase = await prisma.purchase.create({
            data: {
              userId: history.userId,
              bookId: history.bookId,
              checkoutId: checkout.id,
              price: history.book.price || 0,
              quantity: 1,
              purchaseDate: history.startedAt || new Date(),
            },
          })

          fixed.push({
            userId: history.userId,
            bookId: history.bookId,
            bookTitle: history.book.title,
            purchaseId: newPurchase.id,
            checkoutId: checkout.id,
          })
        } catch (error) {
          console.error(`Failed to fix inconsistency for reading history ${history.id}:`, error)
        }
      }
    }

    return NextResponse.json(
      {
        message: "Inconsistency check completed",
        totalReadingHistories: readingHistories.length,
        inconsistenciesFound: inconsistencies.length,
        inconsistenciesFixed: fixed.length,
        details: {
          inconsistencies,
          fixed,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error checking reading history inconsistencies:", error)
    return NextResponse.json({ error: "Failed to check reading history inconsistencies" }, { status: 500 })
  }
}

