import { NextResponse } from "next/server"
import {  UserRole } from "@prisma/client"
import { faker } from "@faker-js/faker"
import prisma from "@/lib/prisma"

// Enhanced category structure with more diverse categories
const enhancedCategories = [
  {
    name: "Fiction",
    description: "Imaginative works of prose, primarily novels and short stories",
    subcategories: [
      "Literary Fiction",
      "Science Fiction",
      "Fantasy",
      "Mystery",
      "Thriller",
      "Horror",
      "Romance",
      "Historical Fiction",
      "Dystopian",
      "Adventure",
    ],
  },
  {
    name: "Non-Fiction",
    description: "Works based on facts and real events",
    subcategories: [
      "Biography",
      "Autobiography",
      "Memoir",
      "History",
      "Science",
      "Philosophy",
      "Psychology",
      "Self-Help",
      "Travel",
      "True Crime",
    ],
  },
  {
    name: "Academic",
    description: "Educational and scholarly works",
    subcategories: [
      "Textbooks",
      "Research Papers",
      "Academic Journals",
      "Case Studies",
      "Dissertations",
      "Reference Books",
      "Educational Resources",
      "Scholarly Articles",
    ],
  },
  {
    name: "Professional Development",
    description: "Books focused on career growth and skill enhancement",
    subcategories: [
      "Business",
      "Leadership",
      "Management",
      "Marketing",
      "Finance",
      "Entrepreneurship",
      "Career Guidance",
      "Productivity",
      "Communication Skills",
    ],
  },
  {
    name: "Technology",
    description: "Books about computing, programming, and digital technologies",
    subcategories: [
      "Programming",
      "Web Development",
      "Data Science",
      "Artificial Intelligence",
      "Cybersecurity",
      "Blockchain",
      "Cloud Computing",
      "Digital Marketing",
      "UX/UI Design",
    ],
  },
  {
    name: "Arts & Humanities",
    description: "Works related to creative and cultural expression",
    subcategories: [
      "Art History",
      "Music",
      "Film Studies",
      "Theater",
      "Photography",
      "Architecture",
      "Cultural Studies",
      "Literary Criticism",
      "Creative Writing",
    ],
  },
  {
    name: "Social Sciences",
    description: "Studies of human society and social relationships",
    subcategories: [
      "Sociology",
      "Anthropology",
      "Political Science",
      "Economics",
      "Geography",
      "Urban Studies",
      "Gender Studies",
      "Media Studies",
      "International Relations",
    ],
  },
  {
    name: "Health & Wellness",
    description: "Books about physical and mental wellbeing",
    subcategories: [
      "Nutrition",
      "Fitness",
      "Mental Health",
      "Alternative Medicine",
      "Medical Reference",
      "Yoga",
      "Mindfulness",
      "Healthy Cooking",
      "Preventive Health",
    ],
  },
  {
    name: "Lifestyle",
    description: "Books about daily living and personal interests",
    subcategories: [
      "Cooking",
      "Home Decoration",
      "Gardening",
      "Fashion",
      "Beauty",
      "Parenting",
      "Relationships",
      "Pets",
      "Crafts",
      "Hobbies",
    ],
  },
  {
    name: "Religion & Spirituality",
    description: "Works exploring faith, belief systems, and spiritual practices",
    subcategories: [
      "Christianity",
      "Islam",
      "Judaism",
      "Buddhism",
      "Hinduism",
      "Spirituality",
      "Theology",
      "Religious History",
      "Comparative Religion",
      "Mysticism",
    ],
  },
  {
    name: "Children's Books",
    description: "Literature for young readers",
    subcategories: [
      "Picture Books",
      "Middle Grade",
      "Young Adult",
      "Educational",
      "Fairy Tales",
      "Adventure",
      "Fantasy",
      "Science Fiction",
      "Historical",
    ],
  },
  {
    name: "Comics & Graphic Novels",
    description: "Sequential art storytelling",
    subcategories: [
      "Superhero",
      "Manga",
      "Indie Comics",
      "Graphic Memoirs",
      "Webcomics",
      "Comic Strips",
      "Graphic Journalism",
      "Fantasy",
      "Science Fiction",
    ],
  },
  {
    name: "Language Learning",
    description: "Resources for acquiring new languages",
    subcategories: [
      "English",
      "Spanish",
      "French",
      "German",
      "Chinese",
      "Japanese",
      "Russian",
      "Arabic",
      "Italian",
      "Portuguese",
    ],
  },
  {
    name: "Reference",
    description: "Informational and instructional works",
    subcategories: [
      "Dictionaries",
      "Encyclopedias",
      "Atlases",
      "Almanacs",
      "Style Guides",
      "Handbooks",
      "Manuals",
      "Directories",
      "Catalogs",
    ],
  },
  {
    name: "Science & Mathematics",
    description: "Works about natural sciences and mathematical concepts",
    subcategories: [
      "Physics",
      "Chemistry",
      "Biology",
      "Astronomy",
      "Environmental Science",
      "Algebra",
      "Calculus",
      "Geometry",
      "Statistics",
      "Applied Mathematics",
    ],
  },
]

// Function to generate a random ISBN
function generateISBN() {
  // ISBN-13 format
  const prefix = "978"
  const group = Math.floor(Math.random() * 10).toString()
  const publisher = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("")
  const title = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("")

  // Calculate check digit
  const digits = `${prefix}${group}${publisher}${title}`
  let sum = 0

  for (let i = 0; i < 12; i++) {
    sum += Number.parseInt(digits[i]) * (i % 2 === 0 ? 1 : 3)
  }

  const checkDigit = (10 - (sum % 10)) % 10

  return `${prefix}-${group}-${publisher}-${title}-${checkDigit}`
}

// Function to generate a book cover URL based on the title
function generateBookCoverUrl(title, category) {
  // Create a color based on the category (for visual differentiation)
  let color = "1F85DE" // Default blue

  if (category.toLowerCase().includes("fiction")) color = "E63946" // Red
  if (category.toLowerCase().includes("technology")) color = "2A9D8F" // Teal
  if (category.toLowerCase().includes("business")) color = "F4A261" // Orange
  if (category.toLowerCase().includes("science")) color = "8338EC" // Purple
  if (category.toLowerCase().includes("art")) color = "FB8500" // Bright orange
  if (category.toLowerCase().includes("health")) color = "06D6A0" // Green
  if (category.toLowerCase().includes("children")) color = "FFBE0B" // Yellow
  if (category.toLowerCase().includes("reference")) color = "8D99AE" // Gray blue

  // Create a placeholder with the title text
  const encodedTitle = encodeURIComponent(title.substring(0, 30)) // Limit title length for URL
  return `https://via.placeholder.com/800x1200/${color}/FFFFFF?text=${encodedTitle}`
}

// Function to generate a realistic book description
function generateBookDescription(title, category, subcategory) {
  const descriptionTemplates = [
    `A comprehensive exploration of ${title.toLowerCase()}, examining the intersection of ${category} and ${subcategory}.`,
    `Dive into the world of ${title.toLowerCase()} with this groundbreaking work that challenges conventional thinking about ${subcategory}.`,
    `The definitive guide to ${title.toLowerCase()}, offering practical insights and theoretical frameworks for understanding ${category}.`,
    `An engaging journey through ${title.toLowerCase()}, revealing hidden connections and surprising revelations about ${subcategory}.`,
    `Discover the transformative power of ${title.toLowerCase()} in this thought-provoking examination of ${category} principles.`,
    `A masterful analysis of ${title.toLowerCase()}, combining rigorous research with accessible prose to illuminate ${subcategory} concepts.`,
    `Explore the fascinating realm of ${title.toLowerCase()} through expert analysis and compelling case studies in ${category}.`,
    `This essential resource on ${title.toLowerCase()} provides both beginners and experts with valuable insights into ${subcategory}.`,
    `Revolutionize your understanding of ${title.toLowerCase()} with this innovative approach to ${category} and ${subcategory}.`,
    `A captivating investigation of ${title.toLowerCase()}, offering fresh perspectives on ${subcategory} within the broader context of ${category}.`,
  ]

  return descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)]
}

// Function to generate a list of publishers
async function generatePublishers() {
  const publisherData = [
    { name: "Cambridge University Press", website: "https://www.cambridge.org" },
    { name: "Oxford University Press", website: "https://global.oup.com" },
    { name: "Pearson Education", website: "https://www.pearson.com" },
    { name: "Penguin Random House", website: "https://www.penguinrandomhouse.com" },
    { name: "HarperCollins", website: "https://www.harpercollins.com" },
    { name: "Simon & Schuster", website: "https://www.simonandschuster.com" },
    { name: "Macmillan Publishers", website: "https://us.macmillan.com" },
    { name: "Hachette Book Group", website: "https://www.hachettebookgroup.com" },
    { name: "Wiley", website: "https://www.wiley.com" },
    { name: "McGraw-Hill Education", website: "https://www.mheducation.com" },
    { name: "Scholastic", website: "https://www.scholastic.com" },
    { name: "Springer Nature", website: "https://www.springernature.com" },
    { name: "Elsevier", website: "https://www.elsevier.com" },
    { name: "SAGE Publications", website: "https://us.sagepub.com" },
    { name: "Taylor & Francis", website: "https://www.taylorfrancis.com" },
    { name: "MIT Press", website: "https://mitpress.mit.edu" },
    { name: "Princeton University Press", website: "https://press.princeton.edu" },
    { name: "Yale University Press", website: "https://yalebooks.yale.edu" },
    { name: "Harvard University Press", website: "https://www.hup.harvard.edu" },
    { name: "Routledge", website: "https://www.routledge.com" },
  ]

  const existingPublishers = await prisma.publisher.findMany()

  if (existingPublishers.length > 0) {
    console.log(`Using ${existingPublishers.length} existing publishers`)
    return existingPublishers
  }

  console.log("Creating new publishers")
  const createdPublishers = []

  for (const publisher of publisherData) {
    const createdPublisher = await prisma.publisher.create({
      data: {
        name: publisher.name,
        website: publisher.website,
      },
    })
    createdPublishers.push(createdPublisher)
  }

  return createdPublishers
}

// Function to generate authors
async function generateAuthors() {
  const existingAuthors = await prisma.author.findMany()

  if (existingAuthors.length >= 100) {
    console.log(`Using ${existingAuthors.length} existing authors`)
    return existingAuthors
  }

  console.log("Creating new authors")
  const createdAuthors = [...existingAuthors]
  const targetCount = 100

  // Generate more authors to reach the target count
  for (let i = existingAuthors.length; i < targetCount; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const name = `${firstName} ${lastName}`

    const createdAuthor = await prisma.author.create({
      data: {
        name,
        bio: `${name} is ${faker.person.prefix()} ${faker.person.jobTitle()} specializing in ${faker.company.buzzPhrase()}.`,
        nationality: faker.location.country(),
        birthdate: faker.date.birthdate({ min: 1940, max: 1990, mode: "year" }),
      },
    })
    createdAuthors.push(createdAuthor)
  }

  return createdAuthors
}

// Function to create or get categories
async function generateCategories() {
  const existingCategories = await prisma.category.findMany()

  if (existingCategories.length > 0) {
    console.log(`Using ${existingCategories.length} existing categories`)
    return {
      allCategories: existingCategories,
      parentCategories: await buildParentCategoriesStructure(existingCategories),
    }
  }

  console.log("Creating new categories")
  const createdCategories = []
  const parentCategoriesMap = new Map()

  // Create parent categories first
  for (const categoryData of enhancedCategories) {
    const parentCategory = await prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
      },
    })

    createdCategories.push(parentCategory)
    parentCategoriesMap.set(categoryData.name, {
      parent: parentCategory,
      subcategories: [],
    })

    // Create subcategories
    for (const subName of categoryData.subcategories) {
      const subcategory = await prisma.category.create({
        data: {
          name: subName,
          description: `Subcategory of ${categoryData.name}`,
          parentId: parentCategory.id,
        },
      })

      createdCategories.push(subcategory)
      parentCategoriesMap.get(categoryData.name).subcategories.push(subcategory)
    }
  }

  return {
    allCategories: createdCategories,
    parentCategories: Array.from(parentCategoriesMap.values()),
  }

}

// Helper function to build parent categories structure from flat list
async function buildParentCategoriesStructure(categories) {
  const parentCategoriesMap = new Map()

  // First, identify all parent categories
  for (const category of categories) {
    if (!category.parentId) {
      parentCategoriesMap.set(category.id, {
        parent: category,
        subcategories: [],
      })
    }
  }

  // Then, add subcategories to their parents
  for (const category of categories) {
    if (category.parentId && parentCategoriesMap.has(category.parentId)) {
      parentCategoriesMap.get(category.parentId).subcategories.push(category)
    }
  }

  return Array.from(parentCategoriesMap.values())
}

// Function to generate a fake book
function generateFakeBook(parentCategories, authors, publishers, adminUsers) {
  // Select a random parent category
  const randomParentIndex = Math.floor(Math.random() * parentCategories.length)
  const parentWithSubs = parentCategories[randomParentIndex]

  // Decide whether to use parent or subcategory
  const useSubcategory = parentWithSubs.subcategories && parentWithSubs.subcategories.length > 0 && Math.random() > 0.2 // 80% chance to use subcategory if available

  let category
  let subcategoryName = ""

  if (useSubcategory) {
    const randomSubIndex = Math.floor(Math.random() * parentWithSubs.subcategories.length)
    category = parentWithSubs.subcategories[randomSubIndex]
    subcategoryName = category.name
  } else {
    category = parentWithSubs.parent
  }

  // Select a random author
  const author = authors[Math.floor(Math.random() * authors.length)]

  // Select a random publisher
  const publisher = publishers[Math.floor(Math.random() * publishers.length)]

  // Select a random admin user
  const adminUser = adminUsers[Math.floor(Math.random() * adminUsers.length)]

  // Generate a title based on the category
  const titlePrefix = [
    "The Complete Guide to",
    "Advanced",
    "Introduction to",
    "Mastering",
    "Exploring",
    "Understanding",
    "The Art of",
    "Principles of",
    "Fundamentals of",
    "Essential",
    "Modern",
    "Contemporary",
    "Practical",
    "Theoretical",
    "Applied",
    "Comprehensive",
    "Professional",
    "Strategic",
    "Creative",
    "Innovative",
  ]

  const titleSuffix = [
    "Techniques",
    "Strategies",
    "Approaches",
    "Methods",
    "Concepts",
    "Principles",
    "Practices",
    "Applications",
    "Frameworks",
    "Systems",
    "Theories",
    "Perspectives",
    "Insights",
    "Foundations",
    "Essentials",
    "Handbook",
    "Manual",
    "Guide",
    "Companion",
    "Reference",
  ]

  const prefix = titlePrefix[Math.floor(Math.random() * titlePrefix.length)]
  const suffix = titleSuffix[Math.floor(Math.random() * titleSuffix.length)]

  let title
  if (useSubcategory) {
    title = `${prefix} ${subcategoryName} ${suffix}`
  } else {
    title = `${prefix} ${category.name} ${suffix}`
  }

  // Generate a description
  const description = generateBookDescription(title, category.name, subcategoryName || category.name)

  // Generate keywords
  const keywords = [
    category.name.toLowerCase(),
    ...(subcategoryName ? [subcategoryName.toLowerCase()] : []),
    ...title
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 3),
  ].slice(0, 5)

  // Generate random page count and file size
  const pages = Math.floor(Math.random() * 500) + 100
  const fileSize = `${Math.floor(Math.random() * 5000) + 500} KB`

  // Generate a random price
  const price = (9.99 + Math.random() * 40).toFixed(2)

  // Generate a random publication date in the past 10 years
  const publishedAt = faker.date.past({ years: 10 })

  // Generate a random language with appropriate weighting
  const languages = [
    "English",
    "English",
    "English",
    "English",
    "English", // 50% English
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese", // 10% each for others
  ]
  const language = languages[Math.floor(Math.random() * languages.length)]

  return {
    title,
    description,
    isbn: generateISBN(),
    authorId: author.id,
    publisherId: publisher.id,
    categoryId: category.id,
    fileUrl: `https://example.com/fake-books/${encodeURIComponent(title)}.pdf`,
    fileSize,
    language,
    pages: String(pages),
    publishedAt,
    price,
    keywords,
    userId: adminUser.id,
    available: true,
    fileFormat: "PDF",
    coverUrl: generateBookCoverUrl(title, category.name),
  }
}

export async function POST(request: Request) {
  try {
    // Get the request body to check for parameters
    let requestBody = {}
    try {
      requestBody = await request.json()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // If no body or invalid JSON, use defaults
      requestBody = {}
    }

    const { count = 500, clearExisting = false } = requestBody as {
        count  :number 
        clearExisting :boolean 
    }

    // Check prerequisites - we need admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: UserRole.ADMIN },
    })

    if (adminUsers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No admin users found. Please generate admin users first.",
        },
        { status: 400 },
      )
    }

    // Clear existing books if requested
    if (clearExisting) {
      console.log("Clearing existing books...")
      // Delete in the correct order to respect foreign key constraints
      await prisma.favorite.deleteMany({})
      await prisma.readingHistory.deleteMany({})
      await prisma.bookCover.deleteMany({})
      await prisma.book.deleteMany({})
      console.log("Existing books cleared.")
    }

    // Check if books already exist
    // const existingBookCount = await prisma.book.count()
    // if (existingBookCount > 0 && !clearExisting) {
    //   return NextResponse.json({
    //     success: false,
    //     message: `Books already exist in the database (${existingBookCount} books). Use clearExisting=true to replace them.`,
    //     count: existingBookCount,
    //   })
    // }

    // Generate or get publishers
    const publishers = await generatePublishers()

    // Generate or get authors
    const authors = await generateAuthors()

    // Generate or get categories
    const { allCategories, parentCategories } = await generateCategories()

    console.log(`Generating ${count} fake books...`)

    // Generate books
    const generatedBooks = []
    const adminBookCounts = {}

    // Initialize admin book counts
    for (const admin of adminUsers) {
      adminBookCounts[admin.name] = 0
    }

    // Generate the specified number of books
    for (let i = 0; i < count; i++) {
      // Generate fake book data
      const fakeBookData = generateFakeBook(parentCategories, authors, publishers, adminUsers)

      // Create the book
      const book = await prisma.book.create({
        data: {
          title: fakeBookData.title,
          description: fakeBookData.description,
          isbn: fakeBookData.isbn,
          authorId: fakeBookData.authorId,
          publisherId: fakeBookData.publisherId,
          categoryId: fakeBookData.categoryId,
          fileUrl: fakeBookData.fileUrl,
          fileSize: fakeBookData.fileSize,
          language: fakeBookData.language,
          pages: fakeBookData.pages,
          publishedAt: fakeBookData.publishedAt,
          price: fakeBookData.price,
          keywords: fakeBookData.keywords,
          userId: fakeBookData.userId,
          available: fakeBookData.available,
          fileFormat: fakeBookData.fileFormat,
        },
      })

      // Create book cover
      await prisma.bookCover.create({
        data: {
          bookId: book.id,
          fileUrl: fakeBookData.coverUrl,
          name: `Cover for ${fakeBookData.title}`,
          fileSize: `${Math.floor(Math.random() * 500) + 100} KB`,
          width: 800,
          height: 1200,
          fileFormat: "JPEG",
          type: "Image",
          blurHash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6.",
        },
      })

      // Create thumbnail
      await prisma.bookCover.create({
        data: {
          bookId: book.id,
          fileUrl: fakeBookData.coverUrl.replace("800x1200", "200x300"),
          name: `Thumbnail for ${fakeBookData.title}`,
          fileSize: `${Math.floor(Math.random() * 100) + 20} KB`,
          width: 200,
          height: 300,
          fileFormat: "JPEG",
          type: "THUMBNAIL",
          blurHash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
        },
      })

      // Assign to an admin user via favorites and reading history
      const adminIndex = i % adminUsers.length
      const admin = adminUsers[adminIndex]

      // Create a favorite entry (50% chance)
      if (Math.random() > 0.5) {
        await prisma.favorite.create({
          data: {
            userId: admin.id,
            bookId: book.id,
          },
        })
      }

      // Create reading history (80% chance)
      if (Math.random() > 0.2) {
        const startedAt = faker.date.recent({ days: 90 })
        const completed = Math.random() > 0.3 // 70% chance of completing
        const pagesRead = completed ? Number(book.pages) : Math.floor(Number(book.pages) * Math.random())

        await prisma.readingHistory.create({
          data: {
            userId: admin.id,
            bookId: book.id,
            startedAt,
            lastReadAt: new Date(),
            pagesRead,
            readingTimeMinutes: pagesRead * (Math.random() * 2 + 1), // 1-3 minutes per page
            completed,
            finishedAt: completed ? new Date() : null,
          },
        })
      }

      adminBookCounts[admin.name] = (adminBookCounts[admin.name] || 0) + 1
      generatedBooks.push(book)

      // Log progress every 50 books
      if ((i + 1) % 50 === 0) {
        console.log(`Generated ${i + 1} of ${count} books...`)
      }
    }

    // Calculate statistics
    const categoryStats = {}
    for (const category of allCategories) {
      const bookCount = await prisma.book.count({
        where: { categoryId: category.id },
      })
      categoryStats[category.name] = bookCount
    }

    const languageStats = {}
    const books = await prisma.book.findMany({
      select: { language: true },
    })
    for (const book of books) {
      languageStats[book.language] = (languageStats[book.language] || 0) + 1
    }

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${count} fake books`,
      stats: {
        totalBooks: count,
        publishers: publishers.length,
        authors: authors.length,
        parentCategories: parentCategories.length,
        totalCategories: allCategories.length,
        adminAssignments: adminBookCounts,
        categoriesBreakdown: categoryStats,
        languagesBreakdown: languageStats,
      },
    })
  } catch (error) {
    console.error("Error generating fake books:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate fake books",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

