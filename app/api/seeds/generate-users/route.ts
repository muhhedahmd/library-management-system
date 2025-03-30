import { NextResponse } from "next/server"
import {  GENDER, UserRole } from "@prisma/client"
import { hash } from "bcrypt"
import prisma from "@/lib/prisma"

// Helper function to generate a random date in the past
function randomPastDate(yearsBack = 30) {
  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setFullYear(today.getFullYear() - Math.floor(Math.random() * yearsBack))
  pastDate.setMonth(Math.floor(Math.random() * 12))
  pastDate.setDate(Math.floor(Math.random() * 28) + 1)
  return pastDate
}

// Helper function to generate a random date in the recent past (for reading history)
function recentPastDate(daysBack = 90) {
  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * daysBack))
  return pastDate
}

// User data
const firstNames = [
  "James",
  "Emma",
  "Michael",
  "Sophia",
  "Robert",
  "Olivia",
  "William",
  "Ava",
  "David",
  "Isabella",
  "John",
  "Mia",
  "Richard",
  "Charlotte",
  "Joseph",
  "Amelia",
  "Thomas",
  "Harper",
  "Charles",
  "Evelyn",
  "Daniel",
  "Elizabeth",
  "Matthew",
  "Sofia",
  "Anthony",
  "Avery",
  "Mark",
  "Ella",
  "Donald",
  "Madison",
  "Steven",
  "Scarlett",
  "Paul",
  "Victoria",
  "Andrew",
  "Aria",
  "Joshua",
  "Grace",
  "Kenneth",
  "Chloe",
]

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Anderson",
  "Taylor",
  "Thomas",
  "Hernandez",
  "Moore",
  "Martin",
  "Jackson",
  "Thompson",
  "White",
  "Lopez",
  "Lee",
  "Gonzalez",
  "Harris",
  "Clark",
  "Lewis",
  "Robinson",
  "Walker",
  "Perez",
  "Hall",
  "Young",
  "Allen",
  "Sanchez",
  "Wright",
  "King",
  "Scott",
  "Green",
  "Baker",
  "Adams",
  "Nelson",
  "Hill",
]

const bios = [
  "Avid reader who enjoys fiction and mystery novels.",
  "Book enthusiast with a passion for classic literature.",
  "Loves exploring new worlds through science fiction and fantasy books.",
  "History buff who can't get enough of historical non-fiction.",
  "Self-improvement junkie always looking for the next great read.",
  "Enjoys poetry and philosophical works that challenge the mind.",
  "Thriller and suspense novels keep me on the edge of my seat.",
  "Romance novels are my guilty pleasure.",
  "Technology professional who reads to stay ahead of the curve.",
  "Cooking books and travel memoirs are my favorites.",
  "Academic researcher with a focus on scientific literature.",
  "Bibliophile with a growing collection of rare first editions.",
  "Digital nomad who always has an e-reader packed for travels.",
  "Parent who enjoys reading children's books with the kids.",
  "Retired teacher who now has time to catch up on reading.",
  "Book club organizer who loves discussing literature with others.",
  "Night owl who stays up late reading just one more chapter.",
  "Audiobook listener who consumes books during daily commutes.",
  "Speed reader who can finish a novel in a single sitting.",
  "Multilingual reader who enjoys books in different languages.",
]

const titles = ["Dr.", "Mr.", "Mrs.", "Ms.", "Prof.", "", "", "", "", ""]

const profilePictureUrls = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/1.jpg",
  "https://randomuser.me/api/portraits/men/2.jpg",
  "https://randomuser.me/api/portraits/women/2.jpg",
  "https://randomuser.me/api/portraits/men/3.jpg",
  "https://randomuser.me/api/portraits/women/3.jpg",
  "https://randomuser.me/api/portraits/men/4.jpg",
  "https://randomuser.me/api/portraits/women/4.jpg",
  "https://randomuser.me/api/portraits/men/5.jpg",
  "https://randomuser.me/api/portraits/women/5.jpg",
  "https://randomuser.me/api/portraits/men/6.jpg",
  "https://randomuser.me/api/portraits/women/6.jpg",
  "https://randomuser.me/api/portraits/men/7.jpg",
  "https://randomuser.me/api/portraits/women/7.jpg",
  "https://randomuser.me/api/portraits/men/8.jpg",
  "https://randomuser.me/api/portraits/women/8.jpg",
  "https://randomuser.me/api/portraits/men/9.jpg",
  "https://randomuser.me/api/portraits/women/9.jpg",
  "https://randomuser.me/api/portraits/men/10.jpg",
  "https://randomuser.me/api/portraits/women/10.jpg",
]

export async function POST() {
  try {
    // Get all books, categories, and authors from the database
    const books = await prisma.book.findMany({
      take: 500,
      orderBy: {
        id: "asc",
      },
    })

    const categories = await prisma.category.findMany()
    const authors = await prisma.author.findMany()

    if (books.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No books found in the database. Please generate books first.",
        },
        { status: 400 },
      )
    }

    // Create 50 users
    const users = []
    const userPreferences = []
    const readingHistories = []
    const favorites = []

    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const name = `${firstName} ${lastName}`
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`
      const gender = Math.random() > 0.5 ? GENDER.MALE : GENDER.FEMALE
      const role = Math.random() > 0.9 ? UserRole.ADMIN : UserRole.MEMBER

      // Hash the password
      const hashedPassword = await hash("password123", 10)

      // Create the user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          gender,
          role,
          password: hashedPassword,
          profile: {
            create: {
              bio: bios[Math.floor(Math.random() * bios.length)],
              phoneNumber: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              isVerified: Math.random() > 0.3,
              birthdate: randomPastDate(50),
              title: Math.random() > 0.5 ? `${titles[Math.floor(Math.random() * titles.length)]} ${name}` : null,
              website: JSON.stringify({
                personal:
                  Math.random() > 0.5 ? `https://www.${firstName.toLowerCase()}${lastName.toLowerCase()}.com` : null,
                linkedin:
                  Math.random() > 0.7
                    ? `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`
                    : null,
              }),
              profilePictures: {
                create: {
                  url: profilePictureUrls[Math.floor(Math.random() * profilePictureUrls.length)],
                  publicId: `profile-${i}`,
                  assetId: `asset-${i}`,
                  width: 400,
                  height: 400,
                  format: "jpg",
                  secureUrl: profilePictureUrls[Math.floor(Math.random() * profilePictureUrls.length)],
                  publicUrl: profilePictureUrls[Math.floor(Math.random() * profilePictureUrls.length)],
                  assetFolder: "profiles",
                  displayName: `${name}'s Profile Picture`,
                  tags: ["profile", "user"],
                  hashBlur: "LGF5?xYk^6#M@-5c,1J5@[or[Q6.",
                },
              },
            },
          },
        },
      })

      users.push(user)

      // Create user preferences (2-5 per user)
      const numPreferences = Math.floor(Math.random() * 4) + 2
      const preferredCategories = [...categories].sort(() => 0.5 - Math.random()).slice(0, numPreferences)

      for (const category of preferredCategories) {
        const preference = await prisma.userPreference.create({
          data: {
            userId: user.id,
            categoryId: category.id,
            weight: Math.random() * 9 + 1, // 1-10 weight
          },
        })
        userPreferences.push(preference)
      }

      // Add author preferences (0-3 per user)
      if (authors.length > 0) {
        const numAuthorPrefs = Math.floor(Math.random() * 4)
        const preferredAuthors = [...authors].sort(() => 0.5 - Math.random()).slice(0, numAuthorPrefs)

        for (const author of preferredAuthors) {
          const preference = await prisma.userPreference.create({
            data: {
              userId: user.id,
              authorId: author.id,
              weight: Math.random() * 9 + 1, // 1-10 weight
            },
          })
          userPreferences.push(preference)
        }
      }

      // Create reading history (5-15 books per user)
      const numReadBooks = Math.floor(Math.random() * 11) + 5
      const readBooks = [...books].sort(() => 0.5 - Math.random()).slice(0, numReadBooks)

      for (const book of readBooks) {
        const startedAt = recentPastDate(180) // Started in the last 6 months
        const lastReadAt = new Date(startedAt)
        lastReadAt.setDate(startedAt.getDate() + Math.floor(Math.random() * 30)) // Read over 0-30 days

        const completed = Math.random() > 0.3 // 70% chance of completing the book
        const pagesRead = completed
          ? Number.parseInt(book.pages || "100")
          : Math.floor(Number.parseInt(book.pages || "100") * Math.random())

        const readingTimeMinutes = pagesRead * (Math.random() * 2 + 1) // 1-3 minutes per page

        let finishedAt = null
        let abandonedAt = null

        if (completed) {
          finishedAt = new Date(lastReadAt)
        } else if (Math.random() > 0.5) {
          // 50% chance of abandoning if not completed
          abandonedAt = new Date(lastReadAt)
        }

        const readingHistory = await prisma.readingHistory.create({
          data: {
            userId: user.id,
            bookId: book.id,
            startedAt,
            lastReadAt,
            finishedAt,
            abandonedAt,
            pagesRead,
            readingTimeMinutes: Math.floor(readingTimeMinutes),
            completed,
          },
        })

        readingHistories.push(readingHistory)

        // Add some books as favorites (30% chance for completed books)
        if (completed && Math.random() > 0.7) {
          const favorite = await prisma.favorite.create({
            data: {
              userId: user.id,
              bookId: book.id,
            },
          })
          favorites.push(favorite)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully generated users with profiles, preferences, and reading history",
      stats: {
        users: users.length,
        preferences: userPreferences.length,
        readingHistories: readingHistories.length,
        favorites: favorites.length,
      },
    })
  } catch (error) {
    console.error("Error generating users:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate users",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

