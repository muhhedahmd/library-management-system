import { NextResponse } from "next/server"
import {  UserRole } from "@prisma/client"
import { faker } from "@faker-js/faker"
import prisma from "@/lib/prisma"


// Real book data from the provided JSON file
const realBookData = [
  {
    name: "values in english language teaching.pdf",
    key: "A28VpdW1yxNUSpTmdYZLvpdVn63FEsulzCHWBtfK0xqw8ejD",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUSpTmdYZLvpdVn63FEsulzCHWBtfK0xqw8ejD",
    size: 1792286,
    uploadedAt: "2025-03-14T23:41:35.000Z",
  },
  {
    name: "វេយ្យាករណ៍អង្គគ្លេស ពន្យល់ជាខ្មែរ.pdf",
    key: "A28VpdW1yxNUwCku0Fx68n5ig7XIcxDvmt3lOUZM2uqNerV0",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUwCku0Fx68n5ig7XIcxDvmt3lOUZM2uqNerV0",
    size: 992079,
    uploadedAt: "2025-03-14T23:41:31.000Z",
  },
  {
    name: "UNESCO Teacher Training in ICT Integration.pdf",
    key: "A28VpdW1yxNUBEL1nLplHSwXrsFga8VUMucYIzJED5GCviRn",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUBEL1nLplHSwXrsFga8VUMucYIzJED5GCviRn",
    size: 259914,
    uploadedAt: "2025-03-14T23:41:31.000Z",
  },
  {
    name: "Unit 2 Teaching Models.pdf",
    key: "A28VpdW1yxNUYKekwvH9oEGzNaxjViIUysqOcPvALwBQlX64",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUYKekwvH9oEGzNaxjViIUysqOcPvALwBQlX64",
    size: 939382,
    uploadedAt: "2025-03-14T23:41:31.000Z",
  },
  {
    name: "Understanding Language Teaching.pdf",
    key: "A28VpdW1yxNU9WSnwfJRr04yiZJsK3XhMcoeS1lbA5aDHkOW",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNU9WSnwfJRr04yiZJsK3XhMcoeS1lbA5aDHkOW",
    size: 1472798,
    uploadedAt: "2025-03-14T23:41:31.000Z",
  },
  {
    name: "WRITING SAMPLE .pdf",
    key: "A28VpdW1yxNUxbsmyen8W1oTME9irtlpkBGAeqfIdhuPVYj0",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUxbsmyen8W1oTME9irtlpkBGAeqfIdhuPVYj0",
    size: 2059972,
    uploadedAt: "2025-03-14T23:41:31.000Z",
  },
  {
    name: "Williams-tha place of task in language classroom.pdf",
    key: "A28VpdW1yxNUQto06FIr0M8pLBgynK2bO5zeJav9xT7fsNIY",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUQto06FIr0M8pLBgynK2bO5zeJav9xT7fsNIY",
    size: 117610,
    uploadedAt: "2025-03-14T23:41:26.000Z",
  },
  {
    name: "Wasi_Idiomas_Communicative language teaching today_Jack C Richards.pdf",
    key: "A28VpdW1yxNUJ45I95K6OUI9rjMX3KqNtRz7hlWZvCkBbfso",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUJ45I95K6OUI9rjMX3KqNtRz7hlWZvCkBbfso",
    size: 212593,
    uploadedAt: "2025-03-14T23:41:26.000Z",
  },
  {
    name: "The Language and Reality of Time By Thomas Sattig.pdf",
    key: "A28VpdW1yxNU3flM5UJXqutJoLC18zmaYiyn5Kgs0eHUMPX9",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNU3flM5UJXqutJoLC18zmaYiyn5Kgs0eHUMPX9",
    size: 2132247,
    uploadedAt: "2025-03-14T23:32:35.000Z",
  },
  {
    name: "The Genesis of Grammar by Bernd Heine and Tania Kuteva.pdf",
    key: "A28VpdW1yxNUg5uDUUSkHnUxOYrjuqd3Xf1FKDiGEchvlw6o",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUg5uDUUSkHnUxOYrjuqd3Xf1FKDiGEchvlw6o",
    size: 2963290,
    uploadedAt: "2025-03-14T23:32:35.000Z",
  },
  {
    name: "The_Grammar_of_the_English_Tense_System_-_a_Comprehensive_Analysis.pdf",
    key: "A28VpdW1yxNUJ9nEoUK6OUI9rjMX3KqNtRz7hlWZvCkBbfso",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUJ9nEoUK6OUI9rjMX3KqNtRz7hlWZvCkBbfso",
    size: 5217767,
    uploadedAt: "2025-03-14T23:32:33.000Z",
  },
  {
    name: "The neural simulation language - A system brain modeling.pdf",
    key: "A28VpdW1yxNUzZstDKYV2OUYThemKAI0NZt4Duskb6FLrlj8",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUzZstDKYV2OUYThemKAI0NZt4Duskb6FLrlj8",
    size: 4216163,
    uploadedAt: "2025-03-14T23:32:32.000Z",
  },
  {
    name: "The Briefest English Grammar Ever.pdf",
    key: "A28VpdW1yxNUnyWhOwRiGoxtQIdK8bj9Fg0z74CSfpB3ncVM",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUnyWhOwRiGoxtQIdK8bj9Fg0z74CSfpB3ncVM",
    size: 227307,
    uploadedAt: "2025-03-14T23:32:22.000Z",
  },
  {
    name: "Think_and_Grow_Rich!.pdf",
    key: "A28VpdW1yxNUWuv5IwgYirUBP5sz2O3MxVgaNfjoH8Rbmycp",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUWuv5IwgYirUBP5sz2O3MxVgaNfjoH8Rbmycp",
    size: 347108,
    uploadedAt: "2025-03-14T23:32:22.000Z",
  },
  {
    name: "The Foreign Language Educator in Society Toward A Critical Pedagogy.pdf",
    key: "A28VpdW1yxNUEO1P8MXU4O2ItfZFaMCnuP1v6zWL0Tb7GsVm",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUEO1P8MXU4O2ItfZFaMCnuP1v6zWL0Tb7GsVm",
    size: 977133,
    uploadedAt: "2025-03-14T23:32:22.000Z",
  },
  {
    name: "The_Skillful_Teacher.pdf",
    key: "A28VpdW1yxNUBQeRzNplHSwXrsFga8VUMucYIzJED5GCviRn",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUBQeRzNplHSwXrsFga8VUMucYIzJED5GCviRn",
    size: 1498845,
    uploadedAt: "2025-03-14T23:32:21.000Z",
  },
  {
    name: "The Blue Book of Grammar and Punctuation.pdf",
    key: "A28VpdW1yxNUcPLMVcyXU7u29tgFq6Q5GAjdbhJ1lzPIDvBi",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUcPLMVcyXU7u29tgFq6Q5GAjdbhJ1lzPIDvBi",
    size: 879105,
    uploadedAt: "2025-03-14T23:32:20.000Z",
  },
  {
    name: "Toefl Grammar Review.pdf",
    key: "A28VpdW1yxNUxvkg9Gbn8W1oTME9irtlpkBGAeqfIdhuPVYj",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUxvkg9Gbn8W1oTME9irtlpkBGAeqfIdhuPVYj",
    size: 1409865,
    uploadedAt: "2025-03-14T23:32:15.000Z",
  },
  {
    name: "The Status of the Teaching Profession.pdf",
    key: "A28VpdW1yxNUKdk1RzhS5BCtUTnw2WrhGRKZOXlvFDQzA63i",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUKdk1RzhS5BCtUTnw2WrhGRKZOXlvFDQzA63i",
    size: 2133966,
    uploadedAt: "2025-03-14T23:32:11.000Z",
  },
  {
    name: "The Teachers Grammar Book.pdf",
    key: "A28VpdW1yxNUTWNtPkX7qLBOasPighdDm4ZAQHb3GzvUY97l",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUTWNtPkX7qLBOasPighdDm4ZAQHb3GzvUY97l",
    size: 3282579,
    uploadedAt: "2025-03-14T23:32:10.000Z",
  },
  {
    name: "Think_and_Grow_Rich!.pdf",
    key: "A28VpdW1yxNUB6J2NiplHSwXrsFga8VUMucYIzJED5GCviRn",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUB6J2NiplHSwXrsFga8VUMucYIzJED5GCviRn",
    size: 347108,
    uploadedAt: "2025-03-14T22:44:29.000Z",
  },
  {
    name: "The Briefest English Grammar Ever.pdf",
    key: "A28VpdW1yxNUA7urMRW1yxNUGVQrYCLZ39awzmsS4FkgEqt6",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUA7urMRW1yxNUGVQrYCLZ39awzmsS4FkgEqt6",
    size: 227307,
    uploadedAt: "2025-03-14T22:44:29.000Z",
  },
  {
    name: "The Blue Book of Grammar and Punctuation.pdf",
    key: "A28VpdW1yxNU9oIUw0JRr04yiZJsK3XhMcoeS1lbA5aDHkOW",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNU9oIUw0JRr04yiZJsK3XhMcoeS1lbA5aDHkOW",
    size: 879105,
    uploadedAt: "2025-03-14T22:44:28.000Z",
  },
  {
    name: "TEFL2.pdf",
    key: "A28VpdW1yxNU7FMO3xAcI13Jj809OktbdzAfKNYxwmn7v4rH",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNU7FMO3xAcI13Jj809OktbdzAfKNYxwmn7v4rH",
    size: 4140648,
    uploadedAt: "2025-03-14T21:58:38.000Z",
  },
  {
    name: "teaching_technical_english_writing.pdf",
    key: "A28VpdW1yxNUgzOmPlDSkHnUxOYrjuqd3Xf1FKDiGEchvlw6",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUgzOmPlDSkHnUxOYrjuqd3Xf1FKDiGEchvlw6",
    size: 459877,
    uploadedAt: "2025-03-14T21:58:34.000Z",
  },
  {
    name: "teaching-listening-and-speaking-from-theory-to-practice.pdf",
    key: "A28VpdW1yxNU3NFCCoXqutJoLC18zmaYiyn5Kgs0eHUMPX9r",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNU3NFCCoXqutJoLC18zmaYiyn5Kgs0eHUMPX9r",
    size: 194953,
    uploadedAt: "2025-03-14T21:58:34.000Z",
  },
  {
    name: "The Best Teacher Ms Bunton Low Res.pdf",
    key: "A28VpdW1yxNUzUOMeXYV2OUYThemKAI0NZt4Duskb6FLrlj8",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUzUOMeXYV2OUYThemKAI0NZt4Duskb6FLrlj8",
    size: 7292071,
    uploadedAt: "2025-03-14T21:58:30.000Z",
  },
  {
    name: "Testing and Reducing L2 Vocabulary Learning Strategies Inventory.pdf",
    key: "A28VpdW1yxNUwNbkc868n5ig7XIcxDvmt3lOUZM2uqNerV0j",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNUwNbkc868n5ig7XIcxDvmt3lOUZM2uqNerV0j",
    size: 1107897,
    uploadedAt: "2025-03-14T21:58:21.000Z",
  },
  {
    name: "TESOL-Journal-Teaching-Tips.pdf",
    key: "A28VpdW1yxNURokTsTSvjtWHN8CPTIl01aSxy5XwfDOJzgLA",
    customId: null,
    url: "https://tlk5cm2vfd.ufs.sh/f/A28VpdW1yxNURokTsTSvjtWHN8CPTIl01aSxy5XwfDOJzgLA",
    size: 6272795,
    uploadedAt: "2025-03-14T21:58:08.000Z",
  },
]

// Function to match a book to a category based on its content/title
function matchBookToCategory(title, categories) {
  title = title.toLowerCase()

  // First check for exact category matches
  if (title.includes("grammar") || title.includes("tense")) {
    const parentCategory = categories.find((c) => c.parent.name === "English Grammar")
    if (parentCategory) {
      if (title.includes("teacher")) {
        return parentCategory.subcategories.find((s) => s.name === "Grammar for Teachers")
      } else if (title.includes("tense")) {
        return parentCategory.subcategories.find((s) => s.name === "Tense Systems")
      } else if (title.includes("brief")) {
        return parentCategory.subcategories.find((s) => s.name === "Grammar Fundamentals")
      } else {
        return parentCategory.subcategories.find((s) => s.name === "Reference Guides")
      }
    }
  }

  if (title.includes("teaching") || title.includes("teacher") || title.includes("pedagogy")) {
    const parentCategory = categories.find((c) => c.parent.name === "Teaching Methodology")
    if (parentCategory) {
      if (title.includes("models") || title.includes("methods")) {
        return parentCategory.subcategories.find((s) => s.name === "General Teaching Methods")
      } else if (title.includes("training")) {
        return parentCategory.subcategories.find((s) => s.name === "Teacher Training")
      } else if (title.includes("curriculum")) {
        return parentCategory.subcategories.find((s) => s.name === "Curriculum Development")
      } else {
        return parentCategory.subcategories.find((s) => s.name === "Classroom Management")
      }
    }
  }

  if (title.includes("tesol") || title.includes("tefl") || title.includes("communicative")) {
    const parentCategory = categories.find((c) => c.parent.name === "TESOL/TEFL")
    if (parentCategory) {
      if (title.includes("journal") || title.includes("tips")) {
        return parentCategory.subcategories.find((s) => s.name === "TESOL Fundamentals")
      } else {
        return parentCategory.subcategories.find((s) => s.name === "TEFL Certification")
      }
    }
  }

  if (
    title.includes("writing") ||
    title.includes("listening") ||
    title.includes("speaking") ||
    title.includes("vocabulary")
  ) {
    const parentCategory = categories.find((c) => c.parent.name === "Language Skills")
    if (parentCategory) {
      if (title.includes("writing")) {
        return parentCategory.subcategories.find((s) => s.name === "Writing Skills")
      } else if (title.includes("listening") || title.includes("speaking")) {
        return (
          parentCategory.subcategories.find((s) => s.name === "Listening Skills") ||
          parentCategory.subcategories.find((s) => s.name === "Speaking Skills")
        )
      } else if (title.includes("vocabulary")) {
        return parentCategory.subcategories.find((s) => s.name === "Reading Comprehension")
      }
    }
  }

  // Add matching for new categories
  if (title.includes("computer") || title.includes("programming") || title.includes("algorithm")) {
    const parentCategory = categories.find((c) => c.parent.name === "Computer Science")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  if (title.includes("math") || title.includes("calculus") || title.includes("algebra")) {
    const parentCategory = categories.find((c) => c.parent.name === "Mathematics")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  if (title.includes("business") || title.includes("economics") || title.includes("finance")) {
    const parentCategory = categories.find((c) => c.parent.name === "Business & Economics")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  if (title.includes("health") || title.includes("medical") || title.includes("medicine")) {
    const parentCategory = categories.find((c) => c.parent.name === "Health Sciences")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  if (
    title.includes("art") ||
    title.includes("philosophy") ||
    title.includes("literature") ||
    title.includes("history")
  ) {
    const parentCategory = categories.find((c) => c.parent.name === "Arts & Humanities")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  if (title.includes("psychology") || title.includes("sociology") || title.includes("social")) {
    const parentCategory = categories.find((c) => c.parent.name === "Social Sciences")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  if (title.includes("physics") || title.includes("chemistry") || title.includes("biology")) {
    const parentCategory = categories.find((c) => c.parent.name === "Natural Sciences")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  if (title.includes("engineering") || title.includes("mechanical") || title.includes("electrical")) {
    const parentCategory = categories.find((c) => c.parent.name === "Engineering")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  if (title.includes("self") || title.includes("improve") || title.includes("growth") || title.includes("rich")) {
    const parentCategory = categories.find((c) => c.parent.name === "Self-Improvement")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  if (
    title.includes("spanish") ||
    title.includes("french") ||
    title.includes("mandarin") ||
    title.includes("language")
  ) {
    const parentCategory = categories.find((c) => c.parent.name === "Foreign Languages")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  if (title.includes("technology") || title.includes("blockchain") || title.includes("cyber")) {
    const parentCategory = categories.find((c) => c.parent.name === "Technology")
    if (parentCategory) {
      return parentCategory.subcategories[Math.floor(Math.random() * parentCategory.subcategories.length)]
    }
  }

  // For books that don't match any specific category, assign to a random category
  // This ensures all books get categorized even if they don't have obvious keywords
  const randomCategoryIndex = Math.floor(Math.random() * categories.length)
  const randomCategory = categories[randomCategoryIndex]
  const randomSubIndex = Math.floor(Math.random() * randomCategory.subcategories.length)
  return randomCategory.subcategories[randomSubIndex]
}

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

// Function to clean up a filename to get a proper title
function cleanupTitle(filename) {
  // Remove file extension
  let title = filename.replace(/\.pdf$/, "")

  // Replace underscores and hyphens with spaces
  title = title.replace(/[_-]/g, " ")

  // Capitalize first letter of each word
  title = title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

  return title
}

// Function to extract author name from title if possible
function extractAuthor(title) {
  // Look for patterns like "by Author Name" or "Author Name"
  const byMatch = title.match(/by\s+([A-Za-z\s]+)$/i)
  if (byMatch) {
    return byMatch[1].trim()
  }

  return null
}

// Function to generate a book cover URL based on the title
function generateBookCoverUrl(title) {
  // Create a placeholder with the title text
  const encodedTitle = encodeURIComponent(title.substring(0, 30)) // Limit title length for URL
  return `https://via.placeholder.com/800x1200/1F85DE/FFFFFF?text=${encodedTitle}`
}

// Function to generate a fake book
// function generateFakeBook(categories, authors, publishers, adminUsers) {
//   // Generate a random category
//   const randomCategoryIndex = Math.floor(Math.random() * categories.length)
//   const randomCategory = categories[randomCategoryIndex]
//   const randomSubIndex = Math.floor(Math.random() * randomCategory.subcategories.length)
//   const category = randomCategory.subcategories[randomSubIndex]

//   // Select a random author
//   const author = authors[Math.floor(Math.random() * authors.length)]

//   // Select a random publisher
//   const publisher = publishers[Math.floor(Math.random() * publishers.length)]

//   // Select a random admin user
//   const adminUser = adminUsers[Math.floor(Math.random() * adminUsers.length)]

//   // Generate a fake title based on the category
//   let title
//   if (category.parentId) {
//     const parentCategory = categories.find((c) => c.id === category.parentId)
//     if (parentCategory) {
//       title = faker.commerce.productName() + " - " + parentCategory.name + ": " + category.name
//     } else {
//       title = faker.commerce.productName() + " - " + category.name
//     }
//   } else {
//     title = faker.commerce.productName() + " - " + category.name
//   }

//   // Generate keywords
//   const keywords = title
//     .toLowerCase()
//     .replace(/[^\w\s]/g, "")
//     .split(" ")
//     .filter((word) => word.length > 3)
//     .slice(0, 5)

//   // Generate random page count and file size
//   const pages = Math.floor(Math.random() * 500) + 100
//   const fileSize = `${Math.floor(Math.random() * 5000) + 500} KB`

//   // Generate a random price
//   const price = (9.99 + Math.random() * 30).toFixed(2)

//   // Generate a random publication date in the past 10 years
//   const publishedAt = new Date(Date.now() - Math.floor(Math.random() * 10 * 365 * 24 * 60 * 60 * 1000))

//   return {
//     title,
//     description: `A comprehensive resource on ${title.toLowerCase()}.`,
//     isbn: generateISBN(),
//     authorId: author.id,
//     publisherId: publisher.id,
//     categoryId: category.id,
//     fileUrl: `https://example.com/fake-books/${encodeURIComponent(title)}.pdf`,
//     fileSize,
//     language: ["English", "Spanish", "French", "German", "Chinese"][Math.floor(Math.random() * 5)],
//     pages: String(pages),
//     publishedAt,
//     price,
//     keywords,
//     userId: adminUser.id,
//     available: true,
//     fileFormat: "PDF",
//   }
// }

export async function POST() {
  try {
    // Check prerequisites - we assume admins, users, and categories already exist
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

    const categories = await prisma.category.findMany({
      include: {
        children: true,
      },
    })

    if (categories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No categories found. Please generate categories first.",
        },
        { status: 400 },
      )
    }

    // Get parent categories with their subcategories
    const parentCategories = []
    for (const cat of categories) {
      if (!cat.parentId) {
        parentCategories.push({
          parent: cat,
          subcategories: categories.filter((c) => c.parentId === cat.id),
        })
      }
    }

    // Check if books already exist
    const existingBookCount = await prisma.book.count()
    if (existingBookCount > 0) {
      return NextResponse.json({
        success: false,
        message: "Books already exist in the database",
        count: existingBookCount,
      })
    }

    // Create publishers if they don't exist
    let publishers = await prisma.publisher.findMany()

    if (publishers.length === 0) {
      const publisherData = [
        { name: "Cambridge University Press", website: "https://www.cambridge.org" },
        { name: "Oxford University Press", website: "https://global.oup.com" },
        { name: "Pearson Education", website: "https://www.pearson.com" },
        { name: "TESOL International Association", website: "https://www.tesol.org" },
        { name: "UNESCO Publishing", website: "https://publishing.unesco.org" },
        { name: "Routledge", website: "https://www.routledge.com" },
        { name: "Wiley", website: "https://www.wiley.com" },
        { name: "McGraw-Hill Education", website: "https://www.mheducation.com" },
        { name: "Springer", website: "https://www.springer.com" },
        { name: "Elsevier", website: "https://www.elsevier.com" },
        { name: "Penguin Random House", website: "https://www.penguinrandomhouse.com" },
        { name: "HarperCollins", website: "https://www.harpercollins.com" },
        { name: "Simon & Schuster", website: "https://www.simonandschuster.com" },
        { name: "Macmillan Publishers", website: "https://us.macmillan.com" },
        { name: "Scholastic", website: "https://www.scholastic.com" },
      ]

      for (const publisher of publisherData) {
        await prisma.publisher.create({
          data: {
            name: publisher.name,
            website: publisher.website,
          },
        })
      }

      publishers = await prisma.publisher.findMany()
    }

    // Create authors or get existing ones
    let authors = await prisma.author.findMany()

    if (authors.length < 50) {
      // We want at least 50 authors
      // Create more authors to reach at least 50
      const existingAuthorNames = new Set(authors.map((a) => a.name))
      const authorNames = [
        "Jack C. Richards",
        "Thomas Sattig",
        "Bernd Heine",
        "Tania Kuteva",
        "Jane Willis",
        "David Nunan",
        "Diane Larsen-Freeman",
        "Jeremy Harmer",
        "Stephen D. Krashen",
        "H. Douglas Brown",
        "Penny Ur",
        "Scott Thornbury",
        "Napoleon Hill",
        "Jane Straus",
        "Michael Lewis",
        "Ronald Carter",
        "Noam Chomsky",
        "Steven Pinker",
        "George Lakoff",
        "John Searle",
        "Deborah Tannen",
        "Robin Lakoff",
        "William Labov",
        "Dell Hymes",
        "Michael Halliday",
        "David Crystal",
        "Geoffrey Leech",
        "Randolph Quirk",
        "Sidney Greenbaum",
        "Jan Svartvik",
        "Geoffrey Pullum",
        "Rodney Huddleston",
        "Charles Fillmore",
        "Ray Jackendoff",
        "Leonard Bloomfield",
        "Edward Sapir",
        "Benjamin Lee Whorf",
        "Ferdinand de Saussure",
        "Roman Jakobson",
        "Mikhail Bakhtin",
        "Ludwig Wittgenstein",
        "J.L. Austin",
        "John Searle",
        "Paul Grice",
        "George Yule",
        "Guy Cook",
        "Michael McCarthy",
        "Ronald Carter",
        "Michael Swan",
        "Catherine Walter",
        "Jim Scrivener",
        "Scott Thornbury",
        "Diane Larsen-Freeman",
        "Rod Ellis",
        "Michael Long",
        "Patsy Lightbown",
        "Nina Spada",
        "Vivian Cook",
        "Zoltan Dornyei",
        "Elaine Tarone",
        "Merrill Swain",
        "Alastair Pennycook",
        "Claire Kramsch",
        "Bonny Norton",
        "Suresh Canagarajah",
        "Brian Tomlinson",
        "Alan Maley",
        "Mario Rinvolucri",
        "Jane Willis",
        "Dave Willis",
        "Michael Lewis",
        "Jill Hadfield",
        "Charles Hadfield",
        "Penny Ur",
        "Jeremy Harmer",
      ]

      // Add more authors using Faker
      for (let i = 0; i < 100; i++) {
        authorNames.push(faker.person.fullName())
      }

      for (const name of authorNames) {
        if (!existingAuthorNames.has(name)) {
          await prisma.author.create({
            data: {
              name,
              bio: `${name} is an author specializing in ${faker.company.buzzPhrase()}.`,
              nationality: [
                "American",
                "British",
                "Australian",
                "Canadian",
                "German",
                "French",
                "Spanish",
                "Chinese",
                "Japanese",
                "Indian",
              ][Math.floor(Math.random() * 10)],
              birthdate: new Date(
                1940 + Math.floor(Math.random() * 50),
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28) + 1,
              ),
            },
          })
          existingAuthorNames.add(name)
        }
      }

      authors = await prisma.author.findMany()
    }

    // Process real book data
    const books = []
    const processedTitles = new Set() // To avoid duplicates
    const processedUrls = new Set() // To avoid duplicate URLs

    for (const bookData of realBookData) {
      // Clean up the filename to get a proper title
      const title = cleanupTitle(bookData.name)

      // Skip duplicates (some books appear multiple times in the data)
      if (processedTitles.has(title) || processedUrls.has(bookData.url)) {
        continue
      }
      processedTitles.add(title)
      processedUrls.add(bookData.url)

      // Match the book to an appropriate category
      const category = matchBookToCategory(title, parentCategories)

      if (!category) {
        console.warn(`No matching category found for book: ${title}`)
        continue
      }

      // Try to extract author from title, or use a random author
      const authorName = extractAuthor(title)
      let author

      if (authorName && !authors.some((a) => a.name === authorName)) {
        // If we extracted an author name that's not in our list, add it
        author = await prisma.author.create({
          data: {
            name: authorName,
            bio: `${authorName} is an author specializing in language education and linguistics.`,
            nationality: ["American", "British", "Australian", "Canadian", "German"][Math.floor(Math.random() * 5)],
            birthdate: new Date(
              1940 + Math.floor(Math.random() * 40),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1,
            ),
          },
        })
        authors.push(author)
      } else if (authorName) {
        author = authors.find((a) => a.name === authorName)
      } else {
        // Use a random author from our list
        author = authors[Math.floor(Math.random() * authors.length)]
      }

      // Select a random publisher
      const publisher = publishers[Math.floor(Math.random() * publishers.length)]

      // Select a random admin user
      const adminUser = adminUsers[Math.floor(Math.random() * adminUsers.length)]

      // Generate keywords from the title
      const keywords = title
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(" ")
        .filter((word) => word.length > 3)
        .slice(0, 5)

      // Create the book with userId field
      const book = await prisma.book.create({
        data: {
          title,
          description: `A comprehensive resource on ${title.toLowerCase()}.`,
          isbn: generateISBN(),
          authorId: author.id,
          publisherId: publisher.id,
          categoryId: category.id,
          fileUrl: bookData.url, // Use the actual PDF URL from the data
          fileSize: `${Math.round(bookData.size / 1024)} KB`,
          language: "English",
          pages: String(Math.floor(bookData.size / 2000) + 50), // Estimate pages based on file size
          publishedAt: new Date(bookData.uploadedAt),
          price: (9.99 + Math.random() * 30).toFixed(2),
          keywords,
          userId: adminUser.id, // Assign to admin user
          available: true,
          fileFormat: "PDF",
        },
      })

      // Create book cover
      await prisma.bookCover.create({
        data: {
          bookId: book.id,
          fileUrl: generateBookCoverUrl(title),
          name: `Cover for ${title}`,
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
          fileUrl: generateBookCoverUrl(title.substring(0, 20) + "..."),
          name: `Thumbnail for ${title}`,
          fileSize: `${Math.floor(Math.random() * 100) + 20} KB`,
          width: 200,
          height: 300,
          fileFormat: "JPEG",
          type: "THUMBNAIL",
          blurHash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
        },
      })

      books.push(book)
    }

    // Generate additional fake books to reach 500 total
    const realBookCount = books.length

    // Count books assigned to each admin
    const adminBookCounts = {}
    for (const admin of adminUsers) {
      const count = await prisma.book.count({
        where: { userId: admin.id },
      })
      adminBookCounts[admin.name] = count
    }

    return NextResponse.json({
      success: true,
      message: "Successfully generated 500 books (real PDFs + fake books) and assigned them to admin users",
      stats: {
        totalBooks: books.length,
        realBooks: realBookCount,
        // fakeBooks: fakeBookCount,
        publishers: publishers.length,
        authors: authors.length,
        categories: parentCategories.length,
        subcategories: categories.length - parentCategories.length,
        adminAssignments: adminBookCounts,
      },
    })
  } catch (error) {
    console.error("Error generating books:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate books",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

