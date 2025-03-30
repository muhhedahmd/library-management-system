import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Fixed typo in interface name
interface DefaultPagination {
  page: number;
  hasMore: boolean;
}

// Corrected interface to match the actual state structure
interface PaginationState {
  PaginationCategory: DefaultPagination;
  PaginationAuthor: DefaultPagination;
  PaginationPublisher: DefaultPagination;
  PaginationBooks: DefaultPagination; // Added Books pagination
}

// Fixed initialState to match the interface
const initialState: PaginationState = {
  PaginationCategory: {
    page: 0,
    hasMore: true, // Assume there are more items initially
  },
  PaginationAuthor: {
    page: 0,
    hasMore: true, // Assume there are more items initially
  },
  PaginationPublisher: {
    page: 0,
    hasMore: true, // Assume there are more items initially
  },
  PaginationBooks: {
    page: 0,
    hasMore: true, // Added Books pagination
  },
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    // Fixed typo in action names and used consistent payload types
    setCategoryPagination: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationCategory.page = action.payload.page;
      state.PaginationCategory.hasMore = action.payload.hasMore;
    },
    setPublisherPagination: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationPublisher.page = action.payload.page;
      state.PaginationPublisher.hasMore = action.payload.hasMore;
    },
    setAuthorPagination: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationAuthor.page = action.payload.page;
      state.PaginationAuthor.hasMore = action.payload.hasMore;
    },
    // Added book pagination action
    setBooksPagination: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationBooks.page = action.payload.page;
      state.PaginationBooks.hasMore = action.payload.hasMore;
    },
    // Enhanced reset to handle all pagination types
    resetPagination: (state) => {
      state.PaginationCategory.page = 0;
      state.PaginationCategory.hasMore = true;
      state.PaginationAuthor.page = 0;
      state.PaginationAuthor.hasMore = true;
      state.PaginationPublisher.page = 0;
      state.PaginationPublisher.hasMore = true;
      state.PaginationBooks.page = 0;
      state.PaginationBooks.hasMore = true;
    },
    // Added specific reset actions for each pagination type
    resetCategoryPagination: (state) => {
      state.PaginationCategory.page = 0;
      state.PaginationCategory.hasMore = true;
    },
    resetAuthorPagination: (state) => {
      state.PaginationAuthor.page = 0;
      state.PaginationAuthor.hasMore = true;
    },
    resetPublisherPagination: (state) => {
      state.PaginationPublisher.page = 0;
      state.PaginationPublisher.hasMore = true;
    },
    resetBooksPagination: (state) => {
      state.PaginationBooks.page = 0;
      state.PaginationBooks.hasMore = true;
    },
  },
});

// Export all actions
export const {
  setCategoryPagination,
  setPublisherPagination,
  setAuthorPagination,
  setBooksPagination,
  resetPagination,
  resetCategoryPagination,
  resetAuthorPagination,
  resetPublisherPagination,
  resetBooksPagination,
} = paginationSlice.actions;

export default paginationSlice.reducer;