// import { ShapeOfUserSearchMention } from "@/app/api/users/mentions/route";
// import { ShapeOFminmalUserType } from "@/app/api/users/singleuser/route";
import { categorySchema, publisherSchema } from "@/app/_comonents/ZodScheams";
import { ProfileWithPic, UserData } from "@/Types";
import { Author, Category, Publisher } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface PublisherResponse {
    data: Publisher[];
    hasMore: boolean; // Indicates if there are more items to fetch
}
export const apiPublisher = createApi({
    reducerPath: "publisher",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
    endpoints: (build) => ({
        getPublisher: build.query<PublisherResponse, {

            pgnum: number, pgsize: number
        } | undefined>({
            query: ({
                pgnum,
                pgsize
            }) => {
                return {
                    url: "api/publishers/get",
                    params: { pgnum, pgsize }
                }

            },
            serializeQueryArgs({
                endpointDefinition,
                endpointName,
                queryArgs
            }) {
                return endpointName
            },
            transformResponse: (response: Publisher[], meta, arg) => {
                const hasMore = response.length === arg.pgsize; // If the response length equals the page size, there might be more items
                return { data: response, hasMore };
            },
            merge: (currentCache, newItems) => {
                currentCache.data.push(...newItems.data); // Append new items to the existing list
                currentCache.hasMore = newItems.hasMore; // Update the hasMore flag
            },



        }),
        createPublisher: build.mutation<Publisher, { body: typeof publisherSchema._type }>({
            query: ({ body }) => ({
                url: "api/publishers/create", // Update the URL to match your API endpoint
                method: "POST",
                body: body,
            }),
            async onQueryStarted({ body }, { dispatch, queryFulfilled }) {
                try {
                    const { data: createdCategory } = await queryFulfilled;
                    // Update the cache with the newly created category
                    dispatch(
                        apiPublisher.util.updateQueryData("getPublisher", undefined, (draft) => {
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
    useCreatePublisherMutation,
    useGetPublisherQuery
} =
    apiPublisher