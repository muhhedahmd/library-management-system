// import { ShapeOfUserSearchMention } from "@/app/api/users/mentions/route";
// import { ShapeOFminmalUserType } from "@/app/api/users/singleuser/route";
import { EditedUserPrefrances, Preference, ProfileWithPic, UserData } from "@/Types";
import { bookCover, Rating, } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiUser = createApi({
  reducerPath: "users",
  tagTypes: ["ReadingHistory", "Favorites", "Purchases", "MemberStats"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    GetUserProfile: build.query<ProfileWithPic, {

      userId?: string
    }>({
      query: ({ userId: userId }) => {
        return {
          url: "api/profile",
          params: {
            userId
          }
        }
      },

    }),
    updateProfile: build.mutation<ProfileWithPic, FormData>({

      query: (formData) => {

        return {
          url: "api/profile/EditProfile",
          method: "PUT",
          body: formData
        }
      },
      async onQueryStarted(queryArgument, { dispatch, queryFulfilled, getState }) {

        console.log({
          getState,
          queryFulfilled,
          dispatch,
          queryArgument
        })
        try {
          const data = await queryFulfilled

          dispatch(apiUser.util.updateQueryData("GetUserProfile", { userId: queryArgument.get("userId") as string }
            , (draft) => {

              Object.assign(draft, data.data)
            }))


        } catch (error) {
          console.log(error)
          // throw new Error(`error`)
        }

      },
    }),
    GetUser: build.query<UserData, {

      userId?: string
    }>({
      query: ({ userId: userId }) => {
        return { url: "api/users/get-user", params: { userId } }
      }
    })
    , getUserPreferences: build.query<prefrancesResponse
      , void
    >({
      query: () => {
        return {
          url: "api/users/preferances"
        }

      }

    }),
    getReadingHistory: build.query<CoustomReadingHistory[], string>({
      query: (userId: string) => `api/users/${userId}/reading-history`,
      providesTags: ["ReadingHistory"],
    }),
    getFavorites: build.query<CoustomFavorite[], string>({
      query: (userId: string) => `/api/users/${userId}/favorites`,
      providesTags: ["Favorites"],
    }),
    getPurchases: build.query<CoustomPurchase[], string>({
      query: (userId: string) => `api/users/${userId}/purchases`,
      providesTags: ["Purchases"],
    }),
    getMemberStats: build.query<CoustomMemberStats, string>({
      query: (userId: string) => `api/users/${userId}/member-stats`,
      providesTags: ["MemberStats"],
    }),

  }),
});

// Export the generated hooks
export const {
  useGetFavoritesQuery ,
  useGetPurchasesQuery,
 useGetMemberStatsQuery,
 useGetReadingHistoryQuery, 
  useUpdateProfileMutation,
  useGetUserProfileQuery,
  useGetUserQuery,
  useGetUserPreferencesQuery
} =
  apiUser;

type prefrancesResponse = {
  preferences: {

    categories: Preference[],
    authors: Preference[],
    Combination: EditedUserPrefrances[]
  }
}

export interface CoustomBook {
  id: string
  title: string
  description?: string
  isbn: string
  author: Author
  publisher: Publisher
  category: Category
  bookCovers: bookCover[]
  price: number
  available: boolean
  pages: string 
  ratings : Rating[]
}

export interface Author {
  id: string
  name: string
  bio?: string
}

export interface Publisher {
  id: string
  name: string
  website?: string
}

export interface Category {
  id: string
  name: string
  description?: string
}



export interface CoustomReadingHistory {
  id: string
  book: CoustomBook
  startedAt: string
  lastReadAt: string
  finishedAt?: string
  pagesRead: number
  readingTimeMinutes: number
  completed: boolean
}

export interface CoustomFavorite {
  id: string
  book: CoustomBook
  createdAt: string

}

export interface CoustomPurchase {
  id: string
  book: CoustomBook
  purchaseDate: string
  price: number
  quantity: number
}

export interface CoustomMemberStats {
  booksRead: number
  readingGoal: number
  favoriteBooks: number
  reviewsWritten: number
  readingStreak: number
  booksPurchased: number
}