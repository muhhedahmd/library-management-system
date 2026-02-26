import type {
  BooksRes,
  BooksResForAnalytics,
  orderBy,
  orderByDirection,
  ratingResponse,
  ReadingHistoryForBook,
  shapeOfCheckOutReq,
  shapeOfResponseOfRatingOfUser,
  shapeOfResponseToggleRatting,
  SingleBook,
  Statics,
} from "@/Types";
import type { Checkout, Favorite, ReadingHistory } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface UpdateBookRequest {
  id: string;
  formData: FormData;
}

interface BookFilters {
  skip?: number;
  take?: number;
  price?: number;
  MoreOrLessPrice?: number;
  range?: number;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  publisherId?: string;
  authorId?: string;
  orderByField?: orderBy;
  orderByDir?: orderByDirection;
}

interface BooksResponse {
  data: BooksRes[];
  hasMore: boolean;
  filters: BookFilters;
}

interface BooksResponseDefault {
  data: BooksRes[];
  hasMore: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function mergeUniqueById<T extends { id: string }>(
  existing: T[],
  incoming: T[],
): T[] {
  if (incoming.length === 0) return existing;
  const map = new Map(existing.map((item) => [item.id, item]));
  incoming.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

// ─── API ───────────────────────────────────────────────────────────────────

export const apiBook = createApi({
  reducerPath: "books",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  tagTypes: ["ReadingHistory", "Book", "Books"],

  endpoints: (build) => ({
    getBooks: build.query<BooksResponse, BookFilters>({
      query: (params) => ({ url: "api/books/get", method: "GET", params }),
      providesTags: ["Books"],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch: ({ currentArg, previousArg }) =>
        JSON.stringify(currentArg) !== JSON.stringify(previousArg),
      transformResponse: (response: BooksRes[], _meta, arg) => ({
        data: response,
        hasMore: response.length === arg.take,
        filters: {
          categoryId: arg.categoryId ?? "",
          publisherId: arg.publisherId ?? "",
          authorId: arg.authorId ?? "",
          ...arg,
        },
      }),
      merge: (currentCache, newItems, { arg }) => {
        const skipOnlyChanged =
          currentCache.filters?.skip !== newItems.filters?.skip;
        const currentSkip = arg.skip ?? 0;
        if (skipOnlyChanged || currentSkip > 0) {
          return {
            data: [...currentCache.data, ...newItems.data],
            hasMore: newItems.hasMore,
            filters: newItems.filters,
          };
        }
        return {
          data: newItems.data,
          hasMore: newItems.hasMore,
          filters: newItems.filters,
        };
      },
    }),

    createBook: build.mutation<SingleBook, {formData: FormData }>({
      query: ({ formData }) => ({
        url: "api/books",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Books"],
    }),
    getSingleBook: build.query<SingleBook, { bookId: string }>({
      query: ({ bookId }) => ({ url: `api/books/${bookId}` }),
      providesTags: ["Book"],
    }),

    getIsBookFav: build.query<Favorite, { bookId: string }>({
      query: ({ bookId }) => ({
        url: "api/books/favourite/singleBookFav",
        params: { bookId },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.bookId}`,
      transformErrorResponse: (response) => {
        if (response.status === 404 || response.status === 500) return {};
        return { error: "Unknown error" };
      },
    }),

    toggleBookFav: build.mutation<
      { tag: string; fav: Favorite },
      { totalFavorites?: number; bookId: string }
    >({
      query: ({ totalFavorites, bookId }) => ({
        url: "api/books/favourite/singleBookFav",
        method: "POST",
        body: { totalFavorites, bookId },
      }),
      async onQueryStarted({ bookId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const delta = data.tag === "ADD" ? 1 : -1;

          dispatch(
            apiBook.util.updateQueryData("getBooks", {}, (draft) => {
              const book = draft.data.find((b) => b.id === bookId);
              if (book) book.totalFavorites = +book.totalFavorites + delta;
            }),
          );

          if (data.tag === "ADD") {
            dispatch(
              apiBook.util.upsertQueryData(
                "getIsBookFav",
                { bookId },
                data.fav,
              ),
            );
          } else {
            dispatch(
              apiBook.util.updateQueryData(
                "getIsBookFav",
                { bookId },
                () => undefined as unknown as Favorite,
              ),
            );
          }
        } catch (error) {
          console.error("toggleBookFav failed:", error);
        }
      },
    }),

    UpdateReadingTime: build.mutation<
      ReadingHistory,
      {
        bookId: string;
        readingTimeMinutes: number;
        pagesRead: number;
        completed: boolean;
      }
    >({
      query: (body) => ({
        url: "/api/books/reading-history",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiBook.util.updateQueryData(
              "ReadingTimeOfBook",
              { bookId: args.bookId },
              (draft) => Object.assign(draft, data),
            ),
          );
        } catch (err) {
          console.error("UpdateReadingTime cache update failed:", err);
        }
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "ReadingHistory", id: arg.bookId },
      ],
    }),

    ReadingTimeOfBook: build.query<ReadingHistory, { bookId: string }>({
      query: ({ bookId }) => ({
        url: `/api/books/reading-history/${bookId}`,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.bookId}`,
      transformResponse: (response: ReadingHistory | null) =>
        response ??
        ({
          bookId: "",
          pagesRead: 0,
          readingTimeMinutes: 0,
          completed: false,
        } as ReadingHistory),
      providesTags: (_result, _error, arg) => [
        { type: "ReadingHistory", id: arg.bookId },
      ],
    }),

    checkOut: build.mutation<Checkout, shapeOfCheckOutReq>({
      query: (body) => ({
        url: "/api/checkout",
        method: "POST",
        body,
      }),
    }),

    getBooklibrary: build.query<BooksRes[], { userId: string | undefined }>({
      query: ({ userId }) => ({
        url: "api/books/library",
        params: { userId },
      }),
    }),

    getCountAdminBook: build.query<{ count: number }, void>({
      query: () => ({ url: "api/books/count-admin-books" }),
    }),

    getAdminBook: build.query<
      BooksResponse,
      {
        skip?: number;
        take?: number;
        categoryId?: string;
        publisherId?: string;
        authorId?: string;
        query?: string;
      }
    >({
      query: (params) => ({ url: "api/books/adminBook", params }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch: ({ currentArg, previousArg }) =>
        JSON.stringify(currentArg) !== JSON.stringify(previousArg),
      transformResponse: (response: BooksRes[], _meta, arg) => ({
        data: response,
        hasMore: response.length === arg.take,
        filters: {
          categoryId: arg.categoryId ?? "",
          publisherId: arg.publisherId ?? "",
          authorId: arg.authorId ?? "",
          ...arg,
        },
      }),
      merge: (currentCache, newItems, { arg }) => {
        const skipOnlyChanged =
          currentCache.filters?.skip !== newItems.filters?.skip;
        const currentSkip = arg.skip ?? 0;
        if (skipOnlyChanged || currentSkip > 0) {
          return {
            data: [...currentCache.data, ...newItems.data],
            hasMore: newItems.hasMore,
            filters: newItems.filters,
          };
        }
        return {
          data: newItems.data,
          hasMore: newItems.hasMore,
          filters: currentCache.filters,
        };
      },
    }),

    AddBookRating: build.mutation<
      shapeOfResponseToggleRatting,
      { bookId: string; rating: number; review: string }
    >({
      query: ({ bookId, rating, review }) => ({
        url: "api/books/rating/toggle",
        method: "POST",
        body: { bookId, value: rating, review },
      }),
    }),

    BookRatingOfUSer: build.query<
      shapeOfResponseOfRatingOfUser,
      { bookId: string }
    >({
      query: ({ bookId }) => ({
        url: "api/books/rating/toggle",
        params: { bookId },
      }),
    }),

    getReadersOfBook: build.query<ReadingHistoryForBook[], { bookId: string }>({
      query: ({ bookId }) => ({
        url: "api/books/reading-history/book",
        params: { bookId },
      }),
    }),

    getStatics: build.query<Statics, void>({
      query: () => ({ url: "api/books/admin-actions/statics" }),
    }),

    getBooksAnalytics: build.query<
      {
        data: {
          popularity: { data: BooksResForAnalytics[]; hasMore: boolean };
          readingHistory: { data: BooksResForAnalytics[]; hasMore: boolean };
          favorites: { data: BooksResForAnalytics[]; hasMore: boolean };
        };
      },
      {
        skip?: number;
        take?: number;
        orderByField?: orderBy;
        orderByDir?: orderByDirection;
      }
    >({
      query: (params) => ({
        url: "api/books/admin-actions/books-analytics",
        params,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.orderByField}-${queryArgs.orderByDir}-${queryArgs.skip}-${queryArgs.take}`,
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      transformResponse: (
        response: { books: BooksResForAnalytics[]; hasMore: boolean },
        _meta,
        arg,
      ) => {
        const empty = { data: [] as BooksResForAnalytics[], hasMore: false };
        return {
          data: {
            popularity:
              arg.orderByField === "popularity"
                ? { data: response.books, hasMore: response.hasMore }
                : empty,
            readingHistory:
              arg.orderByField === "readingHistory"
                ? { data: response.books, hasMore: response.hasMore }
                : empty,
            favorites:
              arg.orderByField === "favorites"
                ? { data: response.books, hasMore: response.hasMore }
                : empty,
          },
        };
      },
      merge: (currentCache, newItems) => ({
        data: {
          popularity: {
            data: mergeUniqueById(
              currentCache.data.popularity.data,
              newItems.data.popularity.data,
            ),
            hasMore: newItems.data.popularity.hasMore,
          },
          readingHistory: {
            data: mergeUniqueById(
              currentCache.data.readingHistory.data,
              newItems.data.readingHistory.data,
            ),
            hasMore: newItems.data.readingHistory.hasMore,
          },
          favorites: {
            data: mergeUniqueById(
              currentCache.data.favorites.data,
              newItems.data.favorites.data,
            ),
            hasMore: newItems.data.favorites.hasMore,
          },
        },
      }),
    }),

    getBookAnalytics: build.query<BooksResForAnalytics, { bookId: string }>({
      query: ({ bookId }) => ({
        url: `api/books/admin-actions/books-analytics/${bookId}`,
      }),
    }),

    getBestsellers: build.query<
      BooksResponseDefault,
      { skip?: number; take?: number; categoryId?: string }
    >({
      query: (params) => ({ url: "api/books/bestsellers", params }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      merge: (currentCache, newItems) => ({
        data: mergeUniqueById(currentCache.data, newItems.data) as BooksRes[],
        hasMore: newItems.hasMore,
      }),
    }),

    getTopRated: build.query<
      BooksResponseDefault,
      { skip?: number; take?: number; categoryId?: string; minRating?: number }
    >({
      query: (params) => ({ url: "api/books/top-rated", params }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      merge: (currentCache, newItems) => ({
        data: mergeUniqueById(currentCache.data, newItems.data) as BooksRes[],
        hasMore: newItems.hasMore,
      }),
    }),

    getNewReleases: build.query<
      BooksResponseDefault,
      { skip?: number; take?: number; categoryId?: string }
    >({
      query: (params) => ({ url: "api/books/new-releases", params }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      merge: (currentCache, newItems) => ({
        data: mergeUniqueById(currentCache.data, newItems.data) as BooksRes[],
        hasMore: newItems.hasMore,
      }),
    }),

    updateBook: build.mutation<{ success: boolean }, UpdateBookRequest>({
      query: ({ id, formData }) => ({
        url: `api/books/${id}/update`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Book", "Books"],
    }),

    getRatingsOfBook: build.query<
      ratingResponse[] | undefined,
      { bookId: string | undefined }
    >({
      query: ({ bookId }) => ({ url: `api/books/${bookId}/ratings` }),
    }),
  }),
});

export const {
  useGetRatingsOfBookQuery,
  useGetBooksQuery,
  useCreateBookMutation,
  useGetSingleBookQuery,
  useReadingTimeOfBookQuery,
  useUpdateReadingTimeMutation,
  useCheckOutMutation,
  useGetBooklibraryQuery,
  useGetIsBookFavQuery,
  useToggleBookFavMutation,
  useGetAdminBookQuery,
  useBookRatingOfUSerQuery,
  useAddBookRatingMutation,
  useGetReadersOfBookQuery,
  useGetCountAdminBookQuery,
  useGetStaticsQuery,
  useGetBooksAnalyticsQuery,
  useGetBookAnalyticsQuery,
  useGetBestsellersQuery,
  useGetNewReleasesQuery,
  useGetTopRatedQuery,
  useUpdateBookMutation,
} = apiBook;
