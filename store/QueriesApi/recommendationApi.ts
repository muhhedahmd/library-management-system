import type { Author, Category } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface RecommendationBook {
  id: string;
  title: string;
  description: string;
  author: { id: string; name: string };
  category: { id: string; name: string };
  bookCovers: { id: string; fileUrl: string; type: string; blurHash?: string }[];
  publishedAt: string;
  pages: number;
  language: string;
  fileFormat: string;
}

export interface RecommendationResponse {
  recommendations: RecommendationBook[];
}
export interface SimilarBooksResponse {
  similarBooks: RecommendationBook[];
}
export interface TrendingBooksResponse {
  recommendations: RecommendationBook[];
}
export interface CollaborativeRecommendationResponse {
  recommendations: RecommendationBook[];
}
export interface PreferenceBasedRecommendationResponse {
  recommendations: RecommendationBook[];
}
export interface ReadingBasedRecommendationResponse {
  recommendations: RecommendationBook[];
}
export interface LogInteractionRequest {
  bookId: string;
  interactionType: "view" | "read" | "favorite" | "purchase" | "rate";
  value?: number;
  duration?: number;
}

// ─── API ───────────────────────────────────────────────────────────────────

export const recommendationApi = createApi({
  reducerPath: "recommendationApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  tagTypes: ["Recommendations", "Interactions"],
  endpoints: (builder) => ({
    getRecommendations: builder.query<
      RecommendationResponse,
      { method?: "rating" | "favorite" | "category" | "author" | "hybrid"; limit?: number }
    >({
      query: (params) => ({ url: "api/recommendations", params }),
      providesTags: ["Recommendations"],
    }),

    getSimilarBooks: builder.query<
      SimilarBooksResponse,
      { bookId: string; limit?: number }
    >({
      query: ({ bookId, limit = 6 }) => ({
        url: "api/recommendations/similar-books",
        params: { bookId, limit },
      }),
    }),

    getTrendingBooks: builder.query<
      TrendingBooksResponse,
      { limit?: number; categoryId?: string }
    >({
      query: ({ limit = 10, categoryId }) => ({
        url: "api/recommendations/trending",
        params: { limit, categoryId },
      }),
    }),

    getCollaborativeRecommendations: builder.query<
      CollaborativeRecommendationResponse,
      { limit?: number }
    >({
      query: ({ limit = 10 }) => ({
        url: "api/recommendations/collaborative",
        params: { limit },
      }),
      providesTags: ["Recommendations"],
    }),

    getPreferenceBasedRecommendations: builder.query<
      PreferenceBasedRecommendationResponse,
      { limit?: number }
    >({
      query: ({ limit = 10 }) => ({
        url: "api/recommendations/preference-based",
        params: { limit },
      }),
      providesTags: ["Recommendations"],
    }),

    getReadingBasedRecommendations: builder.query<
      ReadingBasedRecommendationResponse,
      { limit?: number }
    >({
      query: ({ limit = 10 }) => ({
        url: "api/recommendations/reading-based",
        params: { limit },
      }),
      providesTags: ["Recommendations"],
    }),

    logInteraction: builder.mutation<{ success: boolean }, LogInteractionRequest>({
      query: (interaction) => ({
        url: "log/interaction",
        method: "POST",
        body: interaction,
      }),
      invalidatesTags: ["Recommendations"],
    }),

    userPreferncesCategoryAuthors: builder.query<
      { category: Category[]; author: Author[] },
      { skip?: number; take?: number; userId?: string }
    >({
      query: (params) => ({
        url: "api/recommendations/user-prefernces",
        params,
      }),
    }),
  }),
});

export const {
  useGetRecommendationsQuery,
  useGetSimilarBooksQuery,
  useGetTrendingBooksQuery,
  useGetCollaborativeRecommendationsQuery,
  useGetPreferenceBasedRecommendationsQuery,
  useGetReadingBasedRecommendationsQuery,
  useLogInteractionMutation,
  useUserPreferncesCategoryAuthorsQuery,
} = recommendationApi;
