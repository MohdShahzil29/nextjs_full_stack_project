"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

interface User {
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Cookies.remove("token", { path: "/" });
Cookies.remove("user", { path: "/" });

    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
