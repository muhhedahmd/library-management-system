import type { authorSchema } from "@/app/_components/ZodScheams";
import type { Author } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AuthorsResponse {
  data: Author[];
  hasMore: boolean;
}

export const apiAuthor = createApi({
  reducerPath: "authors",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    getAuthors: build.query<
      AuthorsResponse,
      { pgnum: number; pgsize: number } | undefined
    >({
      query: ({ pgnum, pgsize } = { pgnum: 0, pgsize: 20 }) => ({
        url: "api/authors/get",
        params: { pgnum, pgsize },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      transformResponse: (response: Author[], _meta, arg) => ({
        data: response,
        hasMore: response.length === (arg?.pgsize ?? 20),
      }),
      merge: (currentCache, newItems) => {
        currentCache.data.push(...newItems.data);
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.pgnum !== previousArg?.pgnum,
    }),

    createAuthor: build.mutation<
      Author,
      { body: typeof authorSchema._type }
    >({
      query: ({ body }) => ({
        url: "api/authors/create",
        method: "POST",
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiAuthor.util.updateQueryData("getAuthors", undefined, (draft) => {
              draft.data.unshift(data);
            })
          );
        } catch (error) {
          console.error("createAuthor cache update failed:", error);
        }
      },
    }),
  }),
});

export const { useGetAuthorsQuery, useCreateAuthorMutation } = apiAuthor;
