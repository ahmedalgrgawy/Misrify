import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import userReducer from "../features/userSlice";
import productsReducer from "../features/adminProductsSlice";
import merchantProductsReducer from "../features/merchantProductSlice"
import CategoryReducer from "../features/categorySlice";
import BrandReducer from "../features/brandSlice";
import ProfileReducer from "../features/profileSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: productsReducer,
    merchantProducts:merchantProductsReducer,
    Categories: CategoryReducer,
    Brands: BrandReducer,
    Profile: ProfileReducer,
  },
});  
