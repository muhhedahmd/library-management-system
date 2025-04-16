
import { BooksRes, BooksResForAnalytics, orderBy, orderByDirection, ratingResponse, ReadingHistoryForBook, shapeOfCheckOutReq, shapeOfResponseOfRatingOfUser, shapeOfResponseToggleRatting, SingleBook, Statics } from "@/Types";
import { Book, Checkout, Favorite, Rating, ReadingHistory } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface BooksResponse {
    data: BooksRes[]; // List of categories
    hasMore: boolean;
    filters: {
        skip?: number
        take?: number
        price?: number
        MoreOrLessPrice?: number
        range?: number
        minPrice?: number
        maxPrice?: number
        categoryId?: string
        publisherId?: string
        authorId?: string
        orderByField?: orderBy
        orderByDir?: orderByDirection
    };// Indicates if there are more items to fetch
}
interface BooksResponseDefault {
    data: BooksRes[]; // List of categories
    hasMore: boolean;
}


export const apiBook = createApi({
    reducerPath: "books",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
    tagTypes: ["ReadingHistory" ,"Book", "Books"],



    endpoints: (build) => {
        return {
            getBooks: build.query<BooksResponse, {

                skip?: number
                take?: number
                price?: number
                MoreOrLessPrice?: number
                range?: number
                minPrice?: number
                maxPrice?: number
                categoryId?: string
                publisherId?: string
                authorId?: string
                orderByField?: orderBy
                orderByDir?: orderByDirection



            }>({


                query: ({
                    skip,
                    take,
                    authorId,
                    categoryId,
                    publisherId,
                    orderByField,
                    orderByDir,
                    price,
                    range,
                    maxPrice,
                    minPrice,
                    MoreOrLessPrice
                }) => {

                    return {
                        url: `api/books/get`,
                        method: 'GET',
                        params: {
                            skip,
                            take,
                            categoryId,
                            publisherId,
                            authorId,
                            orderByField,
                            orderByDir,
                            price,
                            range,
                            MoreOrLessPrice,
                            maxPrice,
                            minPrice,
                        }
                    }
                },
                providesTags: ["Books"],

                serializeQueryArgs: ({ endpointName }) => {

                    return endpointName;
                },
                forceRefetch(params) {

                    const prevArgs = params.previousArg || {};
                    const currentArgs = params.currentArg || {};

                    // Force refetch if any of these parameters change
                    return JSON.stringify(prevArgs) !== JSON.stringify(currentArgs)
                },
                transformResponse: (response: BooksRes[], meta, arg) => {


                    const categoryId = arg.categoryId || ""
                    const publisherId = arg.publisherId || ""
                    const authorId = arg.authorId || ""

                    const hasMore = response.length === arg.take; // If the response length equals the page size, there might be more items
                    return {
                        data: response
                        , hasMore,
                        filters: {
                            authorId,
                            categoryId,
                            publisherId ,
                            ...arg
                        }
                    };
                },
                merge: (currentCache, newItems , currentArg) => {
                    
                    const skipOnlyChanged = currentCache.filters?.skip !== newItems.filters?.skip
                    

                    // Check if filter parameters have changed
                  
                    const currentSkip = currentArg.arg.skip || 0
                    // If filters changed, replace the cache entirely
                    if (skipOnlyChanged || (currentSkip ) > 0 ) {
                        return {
                            data: [ ...currentCache.data,...newItems.data],
                            hasMore: newItems.hasMore,
                            filters: newItems.filters
                        };
                    }

                    // If filters haven't changed, append new items
                    return {
                        data: [...newItems.data ],
                        hasMore: newItems.hasMore,
                        filters: newItems.filters
                    };
                }
            }),
            getSingleBook: build.query<SingleBook, {
                bookId: string
            }>({
                query: ({ bookId }) => {
                    return {
                        url: `api/books/${bookId}`,
                        params: {
                            bookId
                        }
                    }
                },
                providesTags: ["Book"],

            }),
            
            getIsBookFav: build.query<Favorite, {

                bookId: string,
            }>({
                // providesTags(result, error, arg) {
                //     return [{ type: "BookFav", id: `${arg.bookId}` }];
                // },
                query: ({ bookId }) => {
                    return {
                        url: `api/books/favourite/singleBookFav`,
                        method: 'GET',
                        params: {
                            bookId
                        }
                    }
                },
                serializeQueryArgs: ({ endpointName, queryArgs }) => {
                    return `${endpointName}-${queryArgs.bookId}`;
                },

                transformErrorResponse: (response,) => {


                    if (response.status === 404) {
                        return {};
                    } else if (response.status === 500) {
                        return {};
                    } else {
                        return { error: "Unknown error" };
                    }
                },



            }),
            toggleBookFav: build.mutation<{
                tag: string,
                fav: Favorite
            }, {
                totalFavorites?: number
                bookId: string
            }>({
                query: ({ totalFavorites, bookId }) => {
                    return {
                        url: `api/books/favourite/singleBookFav`,
                        method: 'POST',
                        body: {
                            totalFavorites,
                            bookId
                        }
                    }
                },

                async onQueryStarted({ bookId }, { dispatch, queryFulfilled }) {
                    try {
                        // Wait for the mutation to complete
                        const { data } = await queryFulfilled;

                        if (data.tag === "ADD") {


                            dispatch(

                                apiBook.util.updateQueryData("getBooks", {

                                }
                                    , (draft) => {
                                        const findBook = draft.data.findIndex(b => b.id === bookId)
                                        if (findBook !== -1) {
                                            draft.data[findBook].totalFavorites = + draft.data[findBook].totalFavorites + 1
                                        }

                                    })
                            )
                            dispatch(
                                apiBook.util.upsertQueryData("getIsBookFav", { bookId }, data.fav),

                            );
                        }
                        if (data.tag === "DEL") {

                            dispatch(

                                apiBook.util.updateQueryData("getBooks", {}
                                    , (draft) => {
                                        const findBook = draft.data.findIndex(b => b.id === bookId)
                                        if (findBook !== -1) {
                                            draft.data[findBook].totalFavorites = +draft.data[findBook].totalFavorites - 1
                                        }

                                    })
                            )

                            dispatch(apiBook.util.updateQueryData("getIsBookFav", { bookId }
                                , (draft: Favorite) => {

                                    if (!draft) {
                                        return data.fav;
                                    }
                                    if (data.tag === "DEL") {
                                        return undefined;

                                    }
                                }));
                        }


                    } catch (error) {
                        // Handle the error if the mutation fails
                        console.error("Mutation failed:", error);
                    }

                }

            }),
            CreateBook: build.mutation({

                query: (book: FormData) => {

                    return {
                        url: `api/books/favourite/singleBookFav`,
                        method: 'POST',
                        body: book
                    }
                }
            }),

            UpdateReadingTime: build.mutation<
                ReadingHistory,
                { bookId: string; readingTimeMinutes: number; pagesRead: number; completed: boolean }
            >({

                query: (queryArgument) => ({
                    url: `/api/books/reading-history`,
                    method: "POST",
                    body: queryArgument,
                }),
                async onQueryStarted(queryArgument, { dispatch, queryFulfilled }) {
                    try {
                        const { data } = await queryFulfilled
                        console.log("Update reading time response:", data)

                        // Update the cache for ReadingTimeOfBook query
                        dispatch(
                            apiBook.util.updateQueryData("ReadingTimeOfBook", { bookId: queryArgument.bookId }, (draft) => {
                                // Check if draft exists and has the correct bookId
                                if (!draft || typeof draft !== "object") {
                                    // If draft doesn't exist, return the new data
                                    return data
                                }

                                // Update all properties from the response
                                Object.assign(draft, data)
                            }),
                        )
                    } catch (err) {
                        console.error("Error updating reading time: ", err)
                    }
                },
                invalidatesTags: (result, error, arg) => [{ type: "ReadingHistory", id: arg.bookId }],
            }),
            ReadingTimeOfBook: build.query<ReadingHistory, { bookId: string }>({
                serializeQueryArgs({ endpointName, queryArgs }) {
                    return `${endpointName}-${queryArgs.bookId}`
                },
                query: ({ bookId }) => {
                    return {
                        url: `/api/books/reading-history/${bookId}`,
                        method: "GET",
                    }
                },
                transformResponse: (response: ReadingHistory | null) => {
                    // If no reading history exists yet, return a default structure
                    if (!response) {
                        return {
                            bookId: "",
                            pagesRead: 0,
                            readingTimeMinutes: 0,
                            completed: false,
                        } as ReadingHistory
                    }
                    return response
                },
                providesTags: (result, error, arg) => [{ type: "ReadingHistory", id: arg.bookId }],

            }),

            checkOut: build.mutation<Checkout, shapeOfCheckOutReq>({

                query: (body) => {
                    return {
                        url: `/api/checkout`,
                        method: 'POST',
                        body: body
                    }
                }
            }
            ),
            getBooklibrary: build.query<BooksRes[], {
                userId: string | undefined
            }>({
                query: ({ userId }) => {
                    return {
                        url: `api/books/library`,
                        method: 'GET',
                        params: {
                            userId
                        }

                    }
                }
            }),

            getCountAdminBook: build.query<{ count: number }, void>({
                query: () => ({
                    url: "api/books/count-admin-books",
                    method: 'GET',
                }),
            }),
            getAdminBook: build.query<BooksResponse, {

                skip?: number,
                take?: number,
                categoryId?: string,
                publisherId?: string,
                authorId?: string,
                query ?: string
            }>({
                query: ({

                    skip,
                    take,
                    categoryId,
                    publisherId,
                    authorId,
                    query 
                }) => {
                    return {

                        url: "api/books/adminBook",
                        params: {
                            query,
                            skip,
                            take,
                            categoryId,
                            publisherId,
                            authorId
                        }

                    }

                },
                serializeQueryArgs: ({ endpointName }) => {
                    return endpointName;
                },
                forceRefetch(params) {
                    const prevArgs = params.previousArg || {};
                    const currentArgs = params.currentArg || {};

                    // Force refetch if any of these parameters change
                    return JSON.stringify(prevArgs) !== JSON.stringify(currentArgs)
                },
                transformResponse: (response: BooksRes[], meta, arg) => {

                    const categoryId = arg.categoryId || ""

                    const publisherId = arg.publisherId || ""
                    const authorId = arg.authorId || ""

                    const hasMore = response.length === arg.take; // If the response length equals the page size, there might be more items
                    return {
                        data: response
                        , hasMore,
                        filters: {
                            authorId,
                            categoryId,
                            publisherId ,
                            ...arg
                        }
                    };
                },
                merge: (currentCache, newItems , currentArg) => {



                    const skipOnlyChanged = currentCache.filters?.skip !== newItems.filters?.skip


                    // Check if filter parameters have changed
                  
                    const currentSkip = currentArg.arg.skip || 0
                    // If filters changed, replace the cache entirely
                    if (skipOnlyChanged || (currentSkip ) > 0 ) {

                        return {
                            data: [ ...currentCache.data ,...newItems.data],
                            hasMore: newItems.hasMore,
                            filters: newItems.filters
                        };
                    }

                    // If filters haven't changed, append new items
                    return {
                        data: [...newItems.data ],
                        hasMore: newItems.hasMore,
                        filters: currentCache.filters
                    };
                }

            }),
            AddBookRating: build.mutation<shapeOfResponseToggleRatting, {
                bookId: string,
                rating: number,
                review: string

            }>({
                query: (body) => {

                    return {
                        url: `api/books/rating/toggle`,
                        method: 'POST',
                        body: {
                            bookId: body.bookId,
                            value: body.rating,
                            review: body.review
                        }
                    }
                }
            }),

            BookRatingOfUSer: build.query<shapeOfResponseOfRatingOfUser, {
                bookId: string,
            }>({
                query: ({ bookId }) => {
                    return {
                        url: `api/books/rating/toggle`,
                        params: {
                            bookId,
                        }
                    }
                }
            }),
            getReadersOfBook: build.query<ReadingHistoryForBook[], {
                bookId: string,
            }>({
                query: ({ bookId }) => {
                    return {
                        url: `api/books/reading-history/book`,
                        params: {
                            bookId,
                        }
                    }
                }
            }),
            getStatics: build.query<Statics, void>({
                query: () => ({
                    url: "api/books/admin-actions/statics",
                    method: 'GET',
                }),
            }),
            getBooksAnalytics: build.query<{
                data: {
                    "popularity": {
                        data: BooksResForAnalytics[] | []
                        hasMore: boolean
                    }
                    "readingHistory": {
                        data: BooksResForAnalytics[] | [],
                        hasMore: boolean
                    }
                    "favorites": {
                        data: BooksResForAnalytics[] | [],
                        hasMore: boolean
                    }
                },
            }, {

                skip?: number,
                take?: number,
                orderByField?: orderBy,
                orderByDir?: orderByDirection
            }>({

                query: ({ skip, take, orderByField, orderByDir }) => ({
                    url: "api/books/admin-actions/books-analytics",
                    method: 'GET',
                    params: { skip, take, orderByField, orderByDir }
                }),
                serializeQueryArgs: ({ endpointName, queryArgs }) => {
                    return endpointName + "-" + queryArgs.orderByField+"-" + queryArgs.orderByDir + "-" + queryArgs.skip + "-" + queryArgs.take
                },
                forceRefetch(params) {
                    const prevArgs = params.previousArg || {};
                    const currentArgs = params.currentArg || {};

                    // Force refetch if any of these parameters change
                    return prevArgs !== currentArgs;
                },
                transformResponse: (response:
                    {
                        books: BooksResForAnalytics[],
                        hasMore: boolean
                    }, meta, arg) => {
                    const data = {
                        popularity: {
                            data: [] as BooksResForAnalytics[]
                            , hasMore: false
                        },
                        readingHistory: {
                            data: [] as BooksResForAnalytics[],
                            hasMore: false
                        },
                        favorites: {
                            data: [] as BooksResForAnalytics[],
                            hasMore: false
                        },


                    }
                    if (arg.orderByField === "popularity") {

                        data.popularity = {
                            data: response.books,
                            hasMore: response.hasMore

                        }
                    }
                    if (arg.orderByField === "readingHistory") {
                        data.readingHistory = {
                            data: response.books,
                            hasMore: response.hasMore

                        }


                    }
                    if (arg.orderByField === "favorites") {
                        data.favorites = {
                            data: response.books,
                            hasMore: response.hasMore

                        }
                    }


                    return {
                        data,
                    }


                },
                merge: (currentCache, newItems) => {
                    // Create a helper function to filter out duplicates by ID
                    
                    const mergeUniqueById = (existing: BooksResForAnalytics[], incoming: BooksResForAnalytics[]) => {
                      if (incoming.length === 0) return existing
                
                      // Create a map of existing items by ID
                      const existingMap = new Map(existing.map((item) => [item.id, item]))
                
                      // Add new items that don't already exist
                      incoming.forEach((item) => {
                        if (!existingMap.has(item.id)) {
                          existingMap.set(item.id, item)
                        }
                      })
                
                      // Convert map back to array
                      return Array.from(existingMap.values())
                    }
                
                    return {
                      data: {
                        popularity: {
                          data: mergeUniqueById(currentCache.data.popularity.data, newItems.data.popularity.data),
                          hasMore: newItems.data.popularity.hasMore,
                        },
                        readingHistory: {
                          data: mergeUniqueById(currentCache.data.readingHistory.data, newItems.data.readingHistory.data),
                          hasMore: newItems.data.readingHistory.hasMore,
                        },
                        favorites: {
                          data: mergeUniqueById(currentCache.data.favorites.data, newItems.data.favorites.data),
                          hasMore: newItems.data.favorites.hasMore,
                        },
                      },
                    }
                  },

            }),
            getBookAnalytics: build.query<BooksResForAnalytics, {
                bookId: string
            }>({
                query: ({ bookId }) => ({
                    url: `api/books/admin-actions/books-analytics/${bookId}`,
                })
            }),
            getBestsellers: build.query<BooksResponseDefault, {
                skip?: number
                take?: number
                categoryId?: string
            }>({
                forceRefetch({
                    currentArg,
                    previousArg
                }) {
                    return currentArg !== previousArg

                },
                serializeQueryArgs({ endpointName }) {
                    return endpointName
                },
                merge(currentCacheData, responseData) {
                    const mergeUniqueById = (existing: Book[], incoming: Book[]) => {
                        if (incoming.length === 0) return existing
                  
                        // Create a map of existing items by ID
                        const existingMap = new Map(existing.map((item) => [item.id, item]))
                  
                        // Add new items that don't already exist
                        incoming.forEach((item) => {
                          if (!existingMap.has(item.id)) {
                            existingMap.set(item.id, item)
                          }
                        })
                  
                        // Convert map back to array
                        return Array.from(existingMap.values())
                      }


                    return {
                        data: mergeUniqueById(currentCacheData.data, responseData.data) as BooksRes[],
                        hasMore: responseData.hasMore
                    }

                },
                query: ({
                    skip,
                    categoryId,
                    take,


                }) => ({
                    url: `api/books/bestsellers`,
                    params: {
                        skip,
                        categoryId,
                        take,
                    }
                })


            }),
            getTopRated: build.query<BooksResponseDefault, {
                skip?: number
                take?: number
                categoryId?: string
                minRating?: number
            }>({
                forceRefetch({
                    currentArg,
                    previousArg
                }) {
                    return currentArg !== previousArg

                },
                serializeQueryArgs({ endpointName }) {
                    return endpointName
                },
                merge(currentCacheData, responseData) {
                    const mergeUniqueById = (existing: Book[], incoming: Book[]) => {
                        if (incoming.length === 0) return existing
                  
                        // Create a map of existing items by ID
                        const existingMap = new Map(existing.map((item) => [item.id, item]))
                  
                        // Add new items that don't already exist
                        incoming.forEach((item) => {
                          if (!existingMap.has(item.id)) {
                            existingMap.set(item.id, item)
                          }
                        })
                  
                        // Convert map back to array
                        return Array.from(existingMap.values())
                      }

                    return {
                        data: mergeUniqueById(currentCacheData.data, responseData.data) as BooksRes[],
                        hasMore: responseData.hasMore
                    }

                },
                query: ({
                    skip,
                    take,
                    categoryId,
                    minRating
                }) => (
                    {
                        url: "api/books/top-rated",
                        params: {
                            skip,
                            take,
                            categoryId,
                            minRating
                        }
                    }
                )
            }),
            getNewReleases: build.query<BooksResponseDefault, {

                skip?: number
                take?: number
                categoryId?: string
            }>({


                forceRefetch({
                    currentArg,
                    previousArg
                }) {
                    return currentArg !== previousArg

                },
                serializeQueryArgs({ endpointName }) {
                    return endpointName
                },
                merge(currentCacheData, responseData) {
                    const mergeUniqueById = (existing: Book[], incoming: Book[]) => {
                        if (incoming.length === 0) return existing
                  
                        // Create a map of existing items by ID
                        const existingMap = new Map(existing.map((item) => [item.id, item]))
                  
                        // Add new items that don't already exist
                        incoming.forEach((item) => {
                          if (!existingMap.has(item.id)) {
                            existingMap.set(item.id, item)
                          }
                        })
                  
                        // Convert map back to array
                        return Array.from(existingMap.values())
                      }

                    return {
                        data: mergeUniqueById(currentCacheData.data ,responseData.data) as BooksRes[],
                        hasMore: responseData.hasMore
                    }

                },


                query: ({
                    skip,
                    take,
                    categoryId
                }) => ({
                    url: "api/books/new-releases",
                    params: {
                        skip,
                        take,
                        categoryId

                    }
                })
            }),
            updateBook: build.mutation<{ success: boolean }, UpdateBookRequest>({
                query: ({ id, formData }) => ({
                  url: `api/books/${id}/update`,
                  method: "PUT",
                  body: formData,
                }),
                invalidatesTags: [  "Book",  "Books"],
              }),
              getRatingsOfBook : build.query< ratingResponse[] |undefined  , {
                bookId : string| undefined
              }>({
                query({
                    bookId
                }) {
                    return {
                        url :`api/books/${bookId}/ratings`

                    }
                },

              })




        }
    },




});

export const { 
    useGetRatingsOfBookQuery
    ,
    
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
    useGetTopRatedQuery ,
    useUpdateBookMutation

} = apiBook;

export interface UpdateBookRequest {
    id: string
    formData: FormData
  }