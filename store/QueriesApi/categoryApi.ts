import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { categorySchema } from "@/app/_components/ZodScheams";
import type { categoryWithchildren } from "@/Types";

interface CategoriesResponse {
  data: categoryWithchildren[];
  hasMore: boolean;
}

export const apiCategory = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    getCategories: build.query<
      CategoriesResponse,
      { pgnum: number; pgsize: number }
    >({
      query: ({ pgnum, pgsize }) => ({
        url: "api/categories/get",
        params: { pgnum, pgsize },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      transformResponse: (
        response: categoryWithchildren[],
        _meta,
        arg
      ) => ({
        data: response,
        hasMore: response.length === arg.pgsize,
      }),
      merge: (currentCache, newItems) => {
        currentCache.data.push(...newItems.data);
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.pgnum !== previousArg?.pgnum,
    }),

    createCategory: build.mutation<
      categoryWithchildren,
      { body: typeof categorySchema._type }
    >({
      query: ({ body }) => ({
        url: "api/categories/create",
        method: "POST",
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiCategory.util.updateQueryData(
              "getCategories",
              undefined,
              (draft) => {
                draft.data.unshift(data);
              }
            )
          );
        } catch (error) {
          console.error("createCategory cache update failed:", error);
        }
      },
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation } = apiCategory;
