// import { ShapeOfUserSearchMention } from "@/app/api/users/mentions/route";
// import { ShapeOFminmalUserType } from "@/app/api/users/singleuser/route";
import { ProfileWithPic, UserData } from "@/Types";
import { User } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiUser = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    GetUserProfile: build.query<ProfileWithPic , {

      userId ?:string
    }>({
      query: ({ userId : userId }) => {


        return {
          url: "api/profile",
          params: {
            userId 
          }
        }
      },
      
    }),
    updateProfile : build.mutation<any , FormData>({

      query :(formData)=> {
        return {
          url : "api/profile/EditProfile",
          method :"PUT",
          body : formData
        }
      }
    })

  }),
});

// Export the generated hooks
export const { 
  useUpdateProfileMutation ,
  useGetUserProfileQuery
} =
  apiUser;
