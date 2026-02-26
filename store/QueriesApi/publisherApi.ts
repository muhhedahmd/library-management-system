import type { publisherSchema } from "@/app/_components/ZodScheams";
import type { Publisher } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface PublisherResponse {
  data: Publisher[];
  hasMore: boolean;
}

export const apiPublisher = createApi({
  reducerPath: "publisher",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    getPublisher: build.query<
      PublisherResponse,
      { pgnum: number; pgsize: number } | undefined
    >({
      query: ({ pgnum, pgsize } = { pgnum: 0, pgsize: 20 }) => ({
        url: "api/publishers/get",
        params: { pgnum, pgsize },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      transformResponse: (response: Publisher[], _meta, arg) => ({
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

    createPublisher: build.mutation<
      Publisher,
      { body: typeof publisherSchema._type }
    >({
      query: ({ body }) => ({
        url: "api/publishers/create",
        method: "POST",
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiPublisher.util.updateQueryData(
              "getPublisher",
              undefined,
              (draft) => {
                draft.data.unshift(data);
              }
            )
          );
        } catch (error) {
          console.error("createPublisher cache update failed:", error);
        }
      },
    }),
  }),
});

export const { useCreatePublisherMutation, useGetPublisherQuery } = apiPublisher;
