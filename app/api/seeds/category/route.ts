import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"


// Define categories for language education books with subcategories
const diverseCategories = [
  {
    name: 'English Grammar',
    description: 'Books about English grammar rules and structures',
    subcategories: [
      'Grammar Fundamentals',
      'Tense Systems',
      'Reference Guides',
      'Grammar for Teachers'
    ]
  },
  {
    name: 'Teaching Methodology',
    description: 'Books about teaching methods and approaches',
    subcategories: [
      'General Teaching Methods',
      'Classroom Management',
      'Teacher Training',
      'Curriculum Development'
    ]
  },
  {
    name: 'TESOL/TEFL',
    description: 'Teaching English to Speakers of Other Languages/Teaching English as a Foreign Language',
    subcategories: [
      'TESOL Fundamentals',
      'TEFL Certification',
      'Teaching Abroad',
      'Cultural Considerations'
    ]
  },
  {
    name: 'Language Skills',
    description: 'Books focused on developing specific language skills',
    subcategories: [
      'Writing Skills',
      'Listening Skills',
      'Speaking Skills',
      'Reading Comprehension'
    ]
  },
  {
    name: 'Computer Science',
    description: 'Books about programming, algorithms, and computer systems',
    subcategories: [
      'Programming Languages',
      'Data Structures',
      'Artificial Intelligence',
      'Web Development'
    ]
  },
  {
    name: 'Mathematics',
    description: 'Books covering various mathematical concepts and applications',
    subcategories: [
      'Algebra',
      'Calculus',
      'Statistics',
      'Geometry'
    ]
  },
  {
    name: 'Business & Economics',
    description: 'Resources for business management and economic theory',
    subcategories: [
      'Marketing',
      'Finance',
      'Entrepreneurship',
      'Macroeconomics'
    ]
  },
  {
    name: 'Health Sciences',
    description: 'Books related to medicine, healthcare, and wellness',
    subcategories: [
      'Anatomy',
      'Nutrition',
      'Public Health',
      'Medical Ethics'
    ]
  },
  {
    name: 'Arts & Humanities',
    description: 'Resources covering creative arts and humanities disciplines',
    subcategories: [
      'Literature',
      'Philosophy',
      'History',
      'Visual Arts'
    ]
  },
  {
    name: 'Social Sciences',
    description: 'Books about human society and social relationships',
    subcategories: [
      'Psychology',
      'Sociology',
      'Anthropology',
      'Political Science'
    ]
  },
  {
    name: 'Natural Sciences',
    description: 'Books covering the study of the natural world',
    subcategories: [
      'Physics',
      'Chemistry',
      'Biology',
      'Environmental Science'
    ]
  },
  {
    name: 'Engineering',
    description: 'Resources for various engineering disciplines',
    subcategories: [
      'Mechanical Engineering',
      'Electrical Engineering',
      'Civil Engineering',
      'Chemical Engineering'
    ]
  },
  {
    name: 'Self-Improvement',
    description: 'Books focused on personal development and growth',
    subcategories: [
      'Productivity',
      'Mindfulness',
      'Leadership',
      'Habit Formation'
    ]
  },
  {
    name: 'Foreign Languages',
    description: 'Resources for learning languages other than English',
    subcategories: [
      'Spanish',
      'Mandarin',
      'French',
      'Arabic'
    ]
  },
  {
    name: 'Technology',
    description: 'Books about modern technology and its applications',
    subcategories: [
      'Blockchain',
      'Internet of Things',
      'Cybersecurity',
      'Cloud Computing'
    ]
  }
];

export async function POST() {
  try {
    // Check if categories already exist
    const existingCategoryCount = await prisma.category.count()

    if (existingCategoryCount > 0) {
      return NextResponse.json({
        success: false,
        message: "Categories already exist in the database",
        count: existingCategoryCount,
      })
    }

    // Create parent categories and subcategories
    const createdCategories = []

    for (const categoryData of diverseCategories) {
      // Create parent category
      const parentCategory = await prisma.category.create({
        data: {
          name: categoryData.name,
          description: categoryData.description,
        },
      })

      // Create subcategories
      const subcategories = []
      for (const subName of categoryData.subcategories) {
        const subcategory = await prisma.category.create({
          data: {
            name: subName,
            description: `Subcategory of ${categoryData.name}`,
            parentId: parentCategory.id,
          },
        })
        subcategories.push(subcategory)
      }

      createdCategories.push({
        parent: parentCategory,
        subcategories,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Successfully created categories for language education books",
      data: {
        parentCategories: createdCategories.length,
        totalCategories: createdCategories.reduce((total, cat) => total + 1 + cat.subcategories.length, 0),
        categories: createdCategories.map((cat) => ({
          parent: cat.parent.name,
          subcategories: cat.subcategories.map((sub) => sub.name),
        })),
      },
    })
  } catch (error) {
    console.error("Error creating categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create categories",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
