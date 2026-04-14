import { createSlice } from "@reduxjs/toolkit";

export interface User {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    username?: string;
    // add other user fields as needed
  };
  profilePicture?: string;
  following?: string[];
}

export interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
    },
    updateTokens: (state, action) => {
      if (state.currentUser) {
        state.currentUser.accessToken = action.payload.accessToken;
        state.currentUser.refreshToken = action.payload.refreshToken;
      }
    },
    loginFailed: (state) => {
      state.isLoading = false;
      state.error = true;
    },
    logout: (state) => {
      return initialState;
    },
    changeProfile: (state, action) => {
      if (state.currentUser) {
        state.currentUser.profilePicture = action.payload;
      }
    },
    following: (state, action) => {
      if (state.currentUser && state.currentUser.following) {
        if (state.currentUser.following.includes(action.payload)) {
          state.currentUser.following.splice(
            state.currentUser.following.findIndex(
              (followingId) => followingId === action.payload
            ),
            1
          );
        } else {
          state.currentUser.following.push(action.payload);
        }
      }
    },
    updateUsername: (state, action) => {
      if (state.currentUser && state.currentUser.user) {
        state.currentUser.user.username = action.payload;
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  changeProfile,
  following,
  updateTokens,
  updateUsername,
} = userSlice.actions;

export default userSlice.reducer;
