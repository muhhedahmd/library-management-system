import { Author, bookCover, Category, GENDER, Publisher, purchase, Rating, ReadingHistory, UserRole } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

type ProfilePicture = {
    id: string;
    url: string;
    publicId: string;
    assetId: string;
    width: number;
    height: number;
    format: string;
    createdAt: Date;
    updatedAt: Date;
    secureUrl: string;
    publicUrl: string;
    assetFolder: string;
    displayName: string;
    tags: string[];
    hashBlur: string;
    profileId: string;
    website: JsonValue;
}

export type ProfileWithPic = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string | null;
    userId: string;
    bio: string | null;
    phoneNumber: string | null;
    isVerified: boolean;
    birthdate: Date | null;
    profilePictures: ProfilePicture[]
    website: JsonValue;
    user: {
        id: string
    }
}

export interface CustomSession {
    user: {
        createdAt: Date,
        updatedAt: Date,
        id: string;
        name?: string | null;
        email?: string | null;
        role: UserRole,
        Gender: GENDER
        profile: ProfileWithPic

    };
}
export type userWithProfile = {
    createdAt: Date,
    updatedAt: Date,
    id: string;
    name?: string | null;
    email?: string | null;
    role: UserRole,
    gender: GENDER
    profile: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        userId: string;
        bio: string | null;
        phoneNumber: string | null;
        isVerified: boolean;
        birthdate: Date | null;
        profilePictures: ProfilePicture[]
        website: JsonValue;
    }
}
export type UserData = {
    createdAt: Date,
    updatedAt: Date,
    id: string;
    name?: string | null;
    email?: string | null;
    role: UserRole,
    Gender: GENDER
    profile: ProfileWithPic,
    user: {
        id: string
    }

}

export interface Preference {
    id: string
    weight: number
    categoryId: string | null
    authorId: string | null
    category?: {
      id: string
      name: string
    } | null
    author?: {
      id: string
      name: string
    } | null
  }
  export interface EditedUserPrefrances {
    
        categoryId: string | null;
        category?: {
            id: string
            name: string
          } | null ,
          author?: {
            id: string
            name: string
          } | null
    
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        weight: number;
    
  }
export type categoryWithchildren = ({
    children: {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
    }[];
} & {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    parentId: string | null;
})

export type BooksRes = (


    {
        id: string
        title: string
        description: string | null
        isbn: string
        authorId: string
        userId: string
        purchase: purchase[] | null
        publisherId: string
        categoryId: string
        fileUrl: string
        fileSize: string | null
        fileFormat: string
        language: string
        pages: string | null
        key: string | null
        fileHash: string | null
        publishedAt: Date | null
        price: number
        available: boolean
        createdAt: Date
        updatedAt: Date
        CountBooks?: number
        category: {
            parent: {
                id: string;
                name: string;
            } | null;
        } & {
            createdAt: Date;
            id: string;
            description: string | null;
            updatedAt: Date;
            name: string;
            parentId: string | null;
        }
        author: Author
        keywords: string[]
        publisher: Publisher
        popularity: number
        averageRating: number
        totalRatings: number
        totalFavorites: number,
        ratings: Rating[],
        bookCovers: bookCover[]
    }
)

export type BooksResForAnalytics = (

    {
        id: string
        title: string
        description: string | null
        isbn: string
        authorId: string
        userId: string
        purchase: {

            id: string;
            userId: string;
            bookId: string;
            purchaseDate: Date;
            price: number;
            quantity: number;
            createdAt: Date;
            updatedAt: Date;
            checkoutId: string;
            user: {
                id: string;
                name: string;
                email: string;
                role: UserRole;
                createdAt: Date;
                updatedAt: Date;
                profile: {
                    profilePictures: ProfilePicture[]
                } | null
        }
        }[] | null
        publisherId: string
        categoryId: string
        fileUrl: string
        fileSize: string | null
        fileFormat: string
        language: string
        pages: string | null
        key: string | null
        fileHash: string | null
        publishedAt: Date | null
        price: number
        available: boolean
        createdAt: Date
        updatedAt: Date
        CountBooks?: number

        category:  Category
        author: Author
        publisher: Publisher
        ratings: Rating[],
        bookCovers: bookCover[]
     

        keywords: string[]
        popularity: number
        averageRating: number
        totalRatings: number
        totalFavorites: number,
    }
)
export type orderBy = "popularity" |
    "readingHistory" |
    "publishedAt" |
    "price" |
    "favorites" |
    "totalRatings" |
    "totalFavorites" |
    "title" |
    "createdAt"
export type orderByDirection = "asc" | "desc"



export type SingleBook = {
    id: string
    title: string
    description: string | null
    isbn: string
    authorId: string
    userId: string
    publisherId: string
    categoryId: string
    fileUrl: string
    fileSize: string | null
    fileFormat: string
    language: string
    pages: string | null
    key: string | null
    fileHash: string | null
    publishedAt: Date | null
    price: number
    available: boolean
    createdAt: Date
    updatedAt: Date
    purchase: purchase[] | null
    category: {
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        parent: Category
    }
    _count: {

        favorites: number,
        ratings: number

    },
    author: Author
    keywords: string[]
    publisher: Publisher
    popularity: number
    averageRating: number
    totalRatings: number
    totalFavorites: number,
    ratings: Rating[],
    bookCovers: bookCover[],
    readingHistory: ReadingHistory[]
}


export type shapeOfCheckOutReq = {
    address: string,
    city: string,
    state: string,
    zip: string,
    country: string,
    street: string,
    book: {
        bookId: string,
        quantity: number,
        price: number
    }[]
    total: number
}

export type shapeOfResponseToggleRatting = {
    message: "created" | "updated",
    rating: Rating,
}

export type shapeOfResponseOfRatingOfUser = {
    bookId: string;
    rating: number;
    id: string;
    userId: string;
    review: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        name: string;
        id: string;
        gender: GENDER;
        email: string;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
        profile: {
            profilePictures: ProfilePicture[]
        }
    }
}
export type  ReadingHistoryForBook =  {
 
    id: string;
    userId: string;
    bookId: string;
    createdAt: Date;
    updatedAt: Date;
    startedAt: Date;
    lastReadAt: Date;
    finishedAt: Date | null;
    pagesRead: number;
    readingTimeMinutes: number;
    completed: boolean;
    abandonedAt: Date | null;
      user: {
        id: string
        name: string
        email: string
        role: UserRole

        profile?: {
          profilePictures?: ProfilePicture[]
        }
      }
    
  }


  export type Statics = {
    favoriteAggregate: {
        _count: number | null,      
        _max: {
            createdAt: Date | null
        }
    },
    purchaseAggregate: {
        _count: number | null,
        _sum: {
            price: number | null
        }
    },
    ratingAggregate: {
        _count: number | null,
        _avg: {
            rating: number | null
        }
    },
    readingHistoryAggregate: {
        _count: number | null
    }   
    
    
    
    
}

export type ratingResponse = {
    rating: number;
    id: string;
    userId: string;
    bookId: string;
    review: string | null;
    createdAt: Date;
    updatedAt: Date;
    user : userWithProfile
}