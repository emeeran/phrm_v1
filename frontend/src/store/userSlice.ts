import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../types/user';

interface UserState {
  isAuthenticated: boolean;
  token: string | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  token: null,
  profile: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; profile: UserProfile }>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.profile = action.payload.profile;
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.profile = null;
      state.error = null;
    },
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
    updateProfileStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    updateProfileSuccess(state, action: PayloadAction<UserProfile>) {
      state.isLoading = false;
      state.profile = action.payload;
      state.error = null;
    },
    updateProfileFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { 
  login, 
  logout, 
  setProfile, 
  updateProfileStart, 
  updateProfileSuccess, 
  updateProfileFailure, 
  clearError 
} = userSlice.actions;

export default userSlice.reducer;
