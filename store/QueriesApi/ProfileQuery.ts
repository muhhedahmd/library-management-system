import type {
  EditedUserPrefrances,
  Preference,
  ProfileWithPic,
  UserData,
} from "@/Types";
import type { bookCover, Rating } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface CoustomBook {
  id: string;
  title: string;
  description?: string;
  isbn: string;
  author: Author;
  publisher: Publisher;
  category: Category;
  bookCovers: bookCover[];
  price: number;
  available: boolean;
  pages: string;
  ratings: Rating[];
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
}

export interface Publisher {
  id: string;
  name: string;
  website?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CoustomReadingHistory {
  id: string;
  book: CoustomBook;
  startedAt: string;
  lastReadAt: string;
  finishedAt?: string;
  pagesRead: number;
  readingTimeMinutes: number;
  completed: boolean;
}

export interface CoustomFavorite {
  id: string;
  book: CoustomBook;
  createdAt: string;
}

export interface CoustomPurchase {
  id: string;
  book: CoustomBook;
  purchaseDate: string;
  price: number;
  quantity: number;
}

export interface CoustomMemberStats {
  booksRead: number;
  readingGoal: number;
  favoriteBooks: number;
  reviewsWritten: number;
  readingStreak: number;
  booksPurchased: number;
}

type PreferencesResponse = {
  preferences: {
    categories: Preference[];
    authors: Preference[];
    Combination: EditedUserPrefrances[];
  };
};

// ─── API ───────────────────────────────────────────────────────────────────

export const apiUser = createApi({
  reducerPath: "users",
  tagTypes: ["ReadingHistory", "Favorites", "Purchases", "MemberStats"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    GetUserProfile: build.query<ProfileWithPic, { userId?: string }>({
      query: ({ userId }) => ({
        url: "api/profile",
        params: { userId },
      }),
    }),

    updateProfile: build.mutation<ProfileWithPic, FormData>({
      query: (formData) => ({
        url: "api/profile/EditProfile",
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiUser.util.updateQueryData(
              "GetUserProfile",
              { userId: formData.get("userId") as string },
              (draft) => {
                Object.assign(draft, data);
              }
            )
          );
        } catch (error) {
          console.error("updateProfile cache update failed:", error);
        }
      },
    }),

    GetUser: build.query<UserData, { userId?: string }>({
      query: ({ userId }) => ({
        url: "api/users/get-user",
        params: { userId },
      }),
    }),

    getUserPreferences: build.query<PreferencesResponse, void>({
      query: () => ({ url: "api/users/preferances" }),
    }),

    getReadingHistory: build.query<CoustomReadingHistory[], string>({
      query: (userId) => `api/users/${userId}/reading-history`,
      providesTags: ["ReadingHistory"],
    }),

    getFavorites: build.query<CoustomFavorite[], string>({
      query: (userId) => `/api/users/${userId}/favorites`,
      providesTags: ["Favorites"],
    }),

    getPurchases: build.query<CoustomPurchase[], string>({
      query: (userId) => `api/users/${userId}/purchases`,
      providesTags: ["Purchases"],
    }),

    getMemberStats: build.query<CoustomMemberStats, string>({
      query: (userId) => `api/users/${userId}/member-stats`,
      providesTags: ["MemberStats"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useGetPurchasesQuery,
  useGetMemberStatsQuery,
  useGetReadingHistoryQuery,
  useUpdateProfileMutation,
  useGetUserProfileQuery,
  useGetUserQuery,
  useGetUserPreferencesQuery,
} = apiUser;
