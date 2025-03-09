import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaginationCategoryState {
  page: number;
  hasMore: boolean;
}

const initialState: { PaginationCategory: PaginationCategoryState } = {
  PaginationCategory: {
    page: 0,
    hasMore: true, // Assume there are more items initially
  },
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPostsPagination: (state, action: PayloadAction<PaginationCategoryState>) => {
      state.PaginationCategory.page = action.payload.page;
      state.PaginationCategory.hasMore = action.payload.hasMore;
    },
    resetPagination: (state) => {
      state.PaginationCategory.page = 0;
      state.PaginationCategory.hasMore = true;
    },
  },
});

export const { setPostsPagination, resetPagination } = paginationSlice.actions;
export default paginationSlice.reducer;