import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { mainUserSlice } from "./Reducers/MainUserSlice";
import { apiUser } from "./QueriesApi/ProfileQuery";
import { apiAuthor } from "./QueriesApi/authorApi";
import { apiCategory } from "./QueriesApi/categoryApi";
import { apiPublisher } from "./QueriesApi/publisherApi";
import { apiBook } from "./QueriesApi/booksApi";
import { recommendationApi } from "./QueriesApi/recommendationApi";
import pagginationSlice from "./Slices/paggnitionSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      mainUserSlice: mainUserSlice.reducer,
      pagination: pagginationSlice,
      [apiUser.reducerPath]: apiUser.reducer,
      [apiAuthor.reducerPath]: apiAuthor.reducer,
      [apiCategory.reducerPath]: apiCategory.reducer,
      [apiPublisher.reducerPath]: apiPublisher.reducer,
      [apiBook.reducerPath]: apiBook.reducer,
      [recommendationApi.reducerPath]: recommendationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        apiUser.middleware,
        apiAuthor.middleware,
        apiCategory.middleware,
        apiPublisher.middleware,
        apiBook.middleware,
        recommendationApi.middleware
      ),
  });

// Infer types from the store factory
const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// ─── Typed hooks (use these everywhere instead of plain hooks) ──────────────
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
export const useAppStore = () => useStore<AppStore>();
