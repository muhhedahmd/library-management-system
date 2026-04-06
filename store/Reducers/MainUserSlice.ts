
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { UserData } from "@/Types";

interface MainUserState {
  user: UserData | null;
  isLoading: boolean;
}

const initialState: MainUserState = {
  user: null,
  isLoading: false,
};

export const mainUserSlice = createSlice({
  name: "main_user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    editUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        Object.assign(state.user, action.payload);
      } else {
        state.user = action.payload as UserData;
      }
    },
    deleteUser: (state) => {
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, editUser, deleteUser, setLoading } =
  mainUserSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.mainUserSlice.user;
export const selectIsLoading = (state: RootState) =>
  state.mainUserSlice.isLoading;

// Legacy aliases kept for backwards compatibility
export const userResponse = selectUser;
export const isLoading = selectIsLoading;
export const editUserResponse = selectUser;
export const isLoadingEditUser = selectIsLoading;

export default mainUserSlice.reducer;
