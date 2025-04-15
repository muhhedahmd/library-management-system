import { Author, Category } from "@prisma/client"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Book {
  id: string
  title: string
  description: string
  author: {
    id: string
    name: string
  }
  category: {
    id: string
    name: string
  }
  bookCovers: {
    id: string
    fileUrl: string
    type: string
    blurHash?: string
  }[]
  publishedAt: string
  pages: number
  language: string
  fileFormat: string
}

export interface RecommendationResponse {
  recommendations: Book[]
}

export interface SimilarBooksResponse {
  similarBooks: Book[]
}

export interface TrendingBooksResponse {
  recommendations: Book[]
}

export interface CollaborativeRecommendationResponse {
  recommendations: Book[]
}

export interface PreferenceBasedRecommendationResponse {
  recommendations: Book[]
}

export interface ReadingBasedRecommendationResponse {
  recommendations: Book[]
}

export interface LogInteractionRequest {
  bookId: string
  interactionType: "view" | "read" | "favorite" | "purchase" | "rate"
  value?: number // For ratings
  duration?: number // For reading time in seconds
}

export const recommendationApi = createApi({
  reducerPath: "recommendationApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  tagTypes: ["Recommendations", "Interactions"],
  endpoints: (builder) => ({
    // Main recommendations endpoint
    getRecommendations: builder.query<RecommendationResponse, {
      method?: "rating" | "favorite" | "category" | "author" | "hybrid"
      limit?: number
    }>({
      query: ({
        limit,
        method
      }) => {
        return {

          url: "api/recommendations",
          params: {
            limit,
                method
          }
        }

      },
      providesTags: ["Recommendations"],
    }),

    // Similar books endpoint
    getSimilarBooks: builder.query<SimilarBooksResponse, { bookId: string; limit?: number }>({
      query: ({ bookId, limit = 6 }) => `api/recommendations/similar-books?bookId=${bookId}&limit=${limit}`,
    }),

    // Trending books endpoint
    getTrendingBooks: builder.query<TrendingBooksResponse, { limit?: number; categoryId?: string }>({
      query: ({ limit = 10, categoryId }) => {
        let url = `api/recommendations/trending?limit=${limit}`
        if (categoryId) url += `&categoryId=${categoryId}`
        return url
      },
    }),

    // Collaborative filtering recommendations
    getCollaborativeRecommendations: builder.query<CollaborativeRecommendationResponse, { limit?: number }>({
      query: ({ limit = 10 }) => `api/recommendations/collaborative?limit=${limit}`,
      providesTags: ["Recommendations"],
    }),

    // Preference-based recommendations
    getPreferenceBasedRecommendations: builder.query<PreferenceBasedRecommendationResponse, { limit?: number }>({
      query: ({ limit = 10 }) => `api/recommendations/preference-based?limit=${limit}`,
      providesTags: ["Recommendations"],
    }),

    // Reading-based recommendations
    getReadingBasedRecommendations: builder.query<ReadingBasedRecommendationResponse, { limit?: number }>({
      query: ({ limit = 10 }) => `api/recommendations/reading-based?limit=${limit}`,
      providesTags: ["Recommendations"],
    }),

    // Log user interaction
    logInteraction: builder.mutation<{ success: boolean }, LogInteractionRequest>({
      query: (interaction) => ({
        url: "log/interaction",
        method: "POST",
        body: interaction,
      }),
      invalidatesTags: ["Recommendations"],
    }),


    userPreferncesCategoryAuthors: builder.query<{
      category: Category[]
      author: Author[]
    }, {
      skip?: number,
      take?: number,
      userId?: string
    }>({
      query: ({
        skip,
        take,
        userId
      }) => {
        return {
          url: `api/recommendations/user-prefernces`,
          method: 'GET',
          params: {
            skip,
            userId,
            take
          }
        }

      }
    }),
  })
})

export const {
  useGetRecommendationsQuery,
  useGetSimilarBooksQuery,
  useGetTrendingBooksQuery,
  useGetCollaborativeRecommendationsQuery,
  useGetPreferenceBasedRecommendationsQuery,
  useGetReadingBasedRecommendationsQuery,
  useLogInteractionMutation,
  useUserPreferncesCategoryAuthorsQuery,
} = recommendationApi

