// import { ShapeOfUserSearchMention } from "@/app/api/users/mentions/route";
// import { ShapeOFminmalUserType } from "@/app/api/users/singleuser/route";
import { EditedUserPrefrances, Preference, ProfileWithPic, UserData } from "@/Types";
import { UserPreference } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiUser = createApi({
  reducerPath: "users",
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

    })

  }),
});

// Export the generated hooks
export const {
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
    Combination  :EditedUserPrefrances[]
  }
} 