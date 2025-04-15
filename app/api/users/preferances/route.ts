import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOption"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types"


// GET: Fetch user preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as CustomSession

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch user preferences with related category and author data
    const preferences = await prisma.userPreference.findMany({
      where: {
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          weight: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
    })

    // Group preferences by type (category or author)
    const categoryPreferences = preferences.filter((pref) => pref.categoryId && pref.authorId === null)
    const authorPreferences = preferences.filter((pref) => pref.authorId && pref.categoryId === null)

    return NextResponse.json({
      preferences: {
        categories: categoryPreferences,
        authors: authorPreferences,
        Combination: preferences.filter((item) => item.authorId && item.categoryId)

      },
    })
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

// POST: Update user preference
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as CustomSession

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const data = await request.json()




    // Validate input data
    const preferenceSchema = z.object({
      categoryId: z.string().optional().nullable(),
      authorId: z.string().optional().nullable(),
      weight: z.number().min(1).max(10),
    })


    const validationResult = preferenceSchema.safeParse(data)
    
    
    if (!validationResult.success) {
      
      console.log(validationResult.error)
      return NextResponse.json(
        {
          error: "Invalid data",
          details: validationResult.error.format(),
        },
        { status: 400 },
      )
    }
    
    const { categoryId, authorId, weight } = validationResult.data
    
    console.log({
      authorId,
      userId,
      categoryId ,
      data : validationResult
    })
    // Prepare data for upsert
 

    if (categoryId && authorId) {

      console.log({
        authorId,
        userId,
        categoryId ,
        data : validationResult
      })

      const findThePerfrance = await prisma.userPreference.findUnique({
        where: {
          userId_categoryId_authorId: {
            authorId,
            userId,
            categoryId,
          }
        },
      })
      console.log({findThePerfrance})



      if (findThePerfrance) {
        const userPreferenceId = findThePerfrance.id
        const updatePreference = await prisma.userPreference.update({
          where: {
            id: userPreferenceId,
          },
          data: {
            weight,
          },
        })
        console.log({updatePreference})
        return NextResponse.json(
          updatePreference
        )

      } else {
        const createPrefrance = await prisma.userPreference.create({
          data: {
            authorId,
            categoryId,
            userId,
            weight,
          }
        })
        console.log({createPrefrance})

        return NextResponse.json(
          createPrefrance
        )
      }

    }
    // Check if the category or author exists
    if (categoryId) {

      const findThePerfrance = await prisma.userPreference.findFirst({
        where: {
          userId,
          categoryId,
        },
      })


      if (findThePerfrance) {
        const userPreferenceId = findThePerfrance.id
        const updatePreference = await prisma.userPreference.update({
          where: {
            id: userPreferenceId,
          },
          data: {
            weight,
          },
        })
        return NextResponse.json(
          updatePreference
        )

      } else {
        const createPrefrance = await prisma.userPreference.create({
          data: {
            categoryId,
            userId,
            weight,
          }
        })

        return NextResponse.json(
          createPrefrance
        )
      }


    }
    if (authorId ) {

      const findThePerfrance = await prisma.userPreference.findFirst({
        where: {
          userId,
          authorId,

        },
      })


      if (findThePerfrance) {
        const userPreferenceId = findThePerfrance.id
        const updatePreference = await prisma.userPreference.update({
          where: {
            id: userPreferenceId,
          },
          data: {
            weight,
          },
        })
        return NextResponse.json(
          updatePreference
        )

      } else {
        const createPrefrance = await prisma.userPreference.create({
          data: {
            authorId,
            userId,
            weight,
          }
        })

        return NextResponse.json(
          createPrefrance
        )
      }


    }





    if (!categoryId && !authorId) {
      return NextResponse.json({ error: "Either categoryId or authorId is required" }, { status: 400 })
    }





  } catch (error) {
    console.error("Error updating user preference:", error)
    return NextResponse.json({ error: "Failed to update preference" }, { status: 500 })
  }
}
