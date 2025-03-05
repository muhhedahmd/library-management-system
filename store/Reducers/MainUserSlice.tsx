import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@prisma/client"; // Assuming you're using Prisma's User model
import { RootState } from "../store";
import { UserData } from "@/Types";

// Define the state type for the slice
interface MainUserState {
  user: UserData | null;
  isLoading: boolean;
}

// Initial state
const initialState: MainUserState = {
  user: null,
  isLoading: false,
};

// Define the slice
export const mainUserSlice = createSlice({
  name: "main_user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },

    editUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }; // Update the user data
      }
    },

    deleteUser: (state) => {
      state.user = null; // Clear the user from the state
    },
  },
});

export const { setUser, editUser, deleteUser } = mainUserSlice.actions;
export const userResponse = (state: RootState) => state.mainUserSlice.user; // Access the user
export const isLoading = (state: RootState) => state.mainUserSlice.isLoading; // Access isLoading
export default mainUserSlice.reducer;
