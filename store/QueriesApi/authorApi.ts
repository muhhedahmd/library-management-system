// import { ShapeOfUserSearchMention } from "@/app/api/users/mentions/route";
// import { ShapeOFminmalUserType } from "@/app/api/users/singleuser/route";
import { authorSchema } from "@/app/_components/ZodScheams";
import { Author } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


interface AuthorsResponse {
    data: Author[]; // List of categories
    hasMore: boolean; // Indicates if there are more items to fetch
}
export const apiAuthor = createApi({

    reducerPath: "authors",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
    endpoints: (build) => ({
        getAuthors: build.query<AuthorsResponse, {

            pgnum: number, pgsize: number
        } | undefined>({
            query: ({


                pgnum,
                pgsize
            }) => {
                return {
                    url: "api/authors/get",
                    params: { pgnum, pgsize }
                }

            },


            serializeQueryArgs({
                endpointName,
            }) {
                return endpointName
            },
            transformResponse: (response: Author[], meta, arg) => {
                const hasMore = response.length === arg.pgsize; // If the response length equals the page size, there might be more items
                return { data: response, hasMore };
            },
            merge: (currentCache, newItems) => {
                currentCache.data.push(...newItems.data); // Append new items to the existing list
                currentCache.hasMore = newItems.hasMore; // Update the hasMore flag
            },
            forceRefetch: ({ currentArg, previousArg }) => currentArg?.pgnum !== previousArg?.pgnum,

        }


        ),
        createAuthor: build.mutation<Author, { body: typeof authorSchema._type }>({
            query: ({ body }) => ({
                url: "api/authors/create", // Update the URL to match your API endpoint
                method: "POST",
                body: body,
            }),
            async onQueryStarted({  }, { dispatch, queryFulfilled }) {
                try {
                    const { data: createdCategory } = await queryFulfilled;
                    // Update the cache with the newly created category
                    dispatch(
                        apiAuthor.util.updateQueryData("getAuthors", undefined, (draft) => {
                            draft.data.unshift(createdCategory); // Add the new category to the beginning of the list
                        })
                    );
                } catch (error) {
                    console.error("Failed to create category:", error);
                }
            },
        }),


    }),


});

// Export the generated hooks
export const {
    useGetAuthorsQuery,
    useCreateAuthorMutation
    //   useUpdateProfileMutation,

} =
    apiAuthor;
