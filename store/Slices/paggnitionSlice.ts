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
  PaginationAdminBooks: DefaultPagination; // Added Books pagination
  PaginationBestSellers: DefaultPagination
  PaginationTopRated: DefaultPagination
  PaginationNewReleases: DefaultPagination
  PaginationAdminBooksFav  : DefaultPagination
PaginationAdminBooksPopularity : DefaultPagination
PaginationAdminBooksReadingHistory: DefaultPagination
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
  PaginationAdminBooks: {
    page: 0,
    hasMore: true, // Added Books pagination
  },
  PaginationBestSellers: {
    page: 0,
    hasMore: true, // Added Books pagination
  },
  PaginationTopRated: {
    page: 0,
    hasMore: true, // Added Books pagination
  },
  PaginationNewReleases: {
    page: 0,
    hasMore: true, // Added Books pagination
  },
  PaginationAdminBooksFav: {
    page: 0,
    hasMore: true, // Added Books pagination
  },
  PaginationAdminBooksPopularity: {
    page: 0,
    hasMore: true, // Added Books pagination
  },
  PaginationAdminBooksReadingHistory: {
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
    setAdminBooksPagination: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationAdminBooks.page = action.payload.page;
      state.PaginationAdminBooks.hasMore = action.payload.hasMore;
    },
    setBestSellersPagination: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationBestSellers.page = action.payload.page;
      state.PaginationBestSellers.hasMore = action.payload.hasMore;

    }
    , setTopRatedPagination: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationTopRated.page = action.payload.page;
      state.PaginationTopRated.hasMore = action.payload.hasMore;  

    }
    , setNewReleasesPagination: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationNewReleases.page = action.payload.page;
      state.PaginationNewReleases.hasMore = action.payload.hasMore;  
    },
    setPaginationAdminBooksFav: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationAdminBooksFav.page = action.payload.page;
      state.PaginationAdminBooksFav.hasMore = action.payload.hasMore;

    }
    , setPaginationAdminBooksPopularity: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationAdminBooksPopularity.page = action.payload.page;
      state.PaginationAdminBooksPopularity.hasMore = action.payload.hasMore;  

    }
    , setPaginationAdminBooksReadingHistory: (state, action: PayloadAction<DefaultPagination>) => {
      state.PaginationAdminBooksReadingHistory.page = action.payload.page;
      state.PaginationAdminBooksReadingHistory.hasMore = action.payload.hasMore;  
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
      state.PaginationAdminBooks.page = 0;
      state.PaginationAdminBooks.hasMore = true;
      state.PaginationBestSellers.page = 0;
      state.PaginationBestSellers.hasMore = true;
      state.PaginationTopRated.page = 0;
      state.PaginationTopRated.hasMore = true;
      state.PaginationNewReleases.page = 0;
      state.PaginationNewReleases.hasMore = true;
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
    resetAdminBooksPagination: (state) => {
      state.PaginationAdminBooks.page = 0;
      state.PaginationAdminBooks.hasMore = true;
    },
  },
});

// Export all actions
export const {
  setBestSellersPagination ,
  setNewReleasesPagination ,
  setTopRatedPagination ,
  setCategoryPagination,
  setPublisherPagination,
  setAuthorPagination,
  setBooksPagination,
  setPaginationAdminBooksFav ,
  setPaginationAdminBooksPopularity ,
  setPaginationAdminBooksReadingHistory, 
  setAdminBooksPagination,
  resetPagination,
  resetCategoryPagination,
  resetAuthorPagination,
  resetPublisherPagination,
  resetBooksPagination,
  resetAdminBooksPagination,
} = paginationSlice.actions;

export default paginationSlice.reducer;