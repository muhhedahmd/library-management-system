import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { categorySchema } from "@/app/_comonents/ZodScheams";
import { Category } from "@prisma/client";

interface CategoriesResponse {
  data: Category[]; // List of categories
  hasMore: boolean; // Indicates if there are more items to fetch
}

export const apiCategory = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    // Fetch categories with pagination
    getCategories: build.query<CategoriesResponse, { pgnum: number; pgsize: number }>({
      query: ({ pgnum, pgsize }) => ({
        url: "api/categories/get",
        params: { pgnum, pgsize },
      }),
      serializeQueryArgs({
        endpointDefinition  ,
        endpointName ,
        queryArgs
      }){
        return endpointName
      },
      transformResponse: (response: Category[], meta, arg) => {
        const hasMore = response.length === arg.pgsize; // If the response length equals the page size, there might be more items
        return { data: response, hasMore };
      },
      merge: (currentCache, newItems) => {
        currentCache.data.push(...newItems.data); // Append new items to the existing list
        currentCache.hasMore = newItems.hasMore; // Update the hasMore flag
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.pgnum !== previousArg?.pgnum,
    }),

    // Create a new category
    createCategory: build.mutation<Category, { body: typeof categorySchema._type }>({
      query: ({ body }) => ({
        url: "api/categories/create",
        method: "POST",
        body: body,
      }),
      async onQueryStarted({ body }, { dispatch, queryFulfilled }) {
        try {
          const { data: createdCategory } = await queryFulfilled;
          // Update the cache with the newly created category
          dispatch(
            apiCategory.util.updateQueryData("getCategories", undefined, (draft) => {
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
export const { useGetCategoriesQuery, useCreateCategoryMutation } = apiCategory;