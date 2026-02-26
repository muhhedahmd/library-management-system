import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface PaginationEntry {
  page: number;
  hasMore: boolean;
}

const defaultEntry = (): PaginationEntry => ({ page: 0, hasMore: true });

interface PaginationState {
  PaginationCategory: PaginationEntry;
  PaginationAuthor: PaginationEntry;
  PaginationPublisher: PaginationEntry;
  PaginationBooks: PaginationEntry;
  PaginationAdminBooks: PaginationEntry;
  PaginationBestSellers: PaginationEntry;
  PaginationTopRated: PaginationEntry;
  PaginationNewReleases: PaginationEntry;
  PaginationAdminBooksFav: PaginationEntry;
  PaginationAdminBooksPopularity: PaginationEntry;
  PaginationAdminBooksReadingHistory: PaginationEntry;
}

const initialState: PaginationState = {
  PaginationCategory: defaultEntry(),
  PaginationAuthor: defaultEntry(),
  PaginationPublisher: defaultEntry(),
  PaginationBooks: defaultEntry(),
  PaginationAdminBooks: defaultEntry(),
  PaginationBestSellers: defaultEntry(),
  PaginationTopRated: defaultEntry(),
  PaginationNewReleases: defaultEntry(),
  PaginationAdminBooksFav: defaultEntry(),
  PaginationAdminBooksPopularity: defaultEntry(),
  PaginationAdminBooksReadingHistory: defaultEntry(),
};

// Helper to create a setter reducer
const set =
  (key: keyof PaginationState) =>
  (state: PaginationState, action: PayloadAction<PaginationEntry>) => {
    state[key] = action.payload;
  };

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setCategoryPagination: set("PaginationCategory"),
    setAuthorPagination: set("PaginationAuthor"),
    setPublisherPagination: set("PaginationPublisher"),
    setBooksPagination: set("PaginationBooks"),
    setAdminBooksPagination: set("PaginationAdminBooks"),
    setBestSellersPagination: set("PaginationBestSellers"),
    setTopRatedPagination: set("PaginationTopRated"),
    setNewReleasesPagination: set("PaginationNewReleases"),
    setPaginationAdminBooksFav: set("PaginationAdminBooksFav"),
    setPaginationAdminBooksPopularity: set("PaginationAdminBooksPopularity"),
    setPaginationAdminBooksReadingHistory: set(
      "PaginationAdminBooksReadingHistory"
    ),

    resetPagination: () => initialState,

    resetCategoryPagination: (state) => {
      state.PaginationCategory = defaultEntry();
    },
    resetAuthorPagination: (state) => {
      state.PaginationAuthor = defaultEntry();
    },
    resetPublisherPagination: (state) => {
      state.PaginationPublisher = defaultEntry();
    },
    resetBooksPagination: (state) => {
      state.PaginationBooks = defaultEntry();
    },
    resetAdminBooksPagination: (state) => {
      state.PaginationAdminBooks = defaultEntry();
    },
  },
});

export const {
  setCategoryPagination,
  setAuthorPagination,
  setPublisherPagination,
  setBooksPagination,
  setAdminBooksPagination,
  setBestSellersPagination,
  setTopRatedPagination,
  setNewReleasesPagination,
  setPaginationAdminBooksFav,
  setPaginationAdminBooksPopularity,
  setPaginationAdminBooksReadingHistory,
  resetPagination,
  resetCategoryPagination,
  resetAuthorPagination,
  resetPublisherPagination,
  resetBooksPagination,
  resetAdminBooksPagination,
} = paginationSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectPaginationBooks = (s: RootState) =>
  s.pagination.PaginationBooks;
export const selectPaginationCategory = (s: RootState) =>
  s.pagination.PaginationCategory;
export const selectPaginationAuthor = (s: RootState) =>
  s.pagination.PaginationAuthor;
export const selectPaginationPublisher = (s: RootState) =>
  s.pagination.PaginationPublisher;
export const selectPaginationBestSellers = (s: RootState) =>
  s.pagination.PaginationBestSellers;
export const selectPaginationTopRated = (s: RootState) =>
  s.pagination.PaginationTopRated;
export const selectPaginationNewReleases = (s: RootState) =>
  s.pagination.PaginationNewReleases;
export const selectPaginationAdminBooks = (s: RootState) =>
  s.pagination.PaginationAdminBooks;

export default paginationSlice.reducer;
