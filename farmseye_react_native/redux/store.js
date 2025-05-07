import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import todaySlice from './todaySlice';


export const store = configureStore({
  reducer : {
    today : todaySlice.reducer,
    auth : authSlice.reducer,
  }
});