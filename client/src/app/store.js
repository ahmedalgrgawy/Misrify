import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import userReducer from "../features/userSlice";
import productsReducer from "../features/productsSlice";
import CategoryReducer from "../features/categorySlice";
import BrandReducer from "../features/brandSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: productsReducer,
    Categories: CategoryReducer,
    Brands: BrandReducer,
  },
});