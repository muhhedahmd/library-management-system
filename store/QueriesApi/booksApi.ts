
import { BooksRes, orderBy, orderByDirection, ReadingHistoryForBook, shapeOfCheckOutReq, shapeOfResponseOfRatingOfUser, shapeOfResponseToggleRatting, SingleBook } from "@/Types";
import {  Checkout, Favorite, ReadingHistory } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface BooksResponse {
    data: BooksRes[]; // List of categories
    hasMore: boolean; // Indicates if there are more items to fetch
}


export const apiBook = createApi({
    reducerPath: "books",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
    // tagTypes: ["BookFav"],
    tagTypes: ["ReadingHistory"],


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
                category?: string
                publisher?: string
                author?: string
                orderByField?: orderBy
                orderByDir?: orderByDirection



            }>({

                query: ({
                    skip,
                    take,
                    author,
                    category,
                    publisher,
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
                            author,
                            category,
                            publisher,
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
                serializeQueryArgs: ({ endpointName }) => {
                    return endpointName;
                },
                forceRefetch(params) {
                    return params.currentArg !== params.previousArg
                },
                transformResponse: (response: BooksRes[], meta, arg) => {
                    const hasMore = response.length === arg.take; // If the response length equals the page size, there might be more items
                    return { data: response, hasMore };
                },
                merge: (currentCache, newItems) => {
                    currentCache.data.push(...newItems.data); // Append new items to the existing list
                    currentCache.hasMore = newItems.hasMore; // Update the hasMore flag
                },
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
                }
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
                query: ({userId}) => {
                    return {
                        url: `api/books/library`,
                        method: 'GET',
                        params:{
                            userId
                        }

                    }
                }
            }),
            getAdminBook: build.query<BooksRes[], {
                skip?: number,
                take?: number
            }>({
                query: ({
                    skip,
                    take
                }) => {
                    return {
                        url: "api/books/adminBook",
                        params: {
                            skip,
                            take
                        }

                    }

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
                query: ({bookId}) => {
                    return {
                        url: `api/books/rating/toggle`,
                        params:{
                            bookId,
                        }
                    }
                }
            }),
            getReadersOfBook: build.query<ReadingHistoryForBook[], {
                bookId: string,
            }>({
                query: ({bookId}) => {
                    return {
                        url: `api/books/reading-history/book`,
                        params:{
                            bookId,
                        }
                    }
                }
            })

        }
    },


});

export const { useGetBooksQuery,
    useCreateBookMutation,
    useGetSingleBookQuery,
    useReadingTimeOfBookQuery,
    useUpdateReadingTimeMutation,
    useCheckOutMutation,
    useGetBooklibraryQuery,
    useGetIsBookFavQuery,
    useToggleBookFavMutation,
    useGetAdminBookQuery ,
    useBookRatingOfUSerQuery,
    useAddBookRatingMutation,
    useGetReadersOfBookQuery
    
} = apiBook;
