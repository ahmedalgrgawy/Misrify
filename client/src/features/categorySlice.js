import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Get All Categories
export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/Categories");
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// create Category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (newCategory, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `admin/create-category`,
        newCategory
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete Category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/delete-category/${categoryId}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Edit Category
export const editCategory = createAsyncThunk(
  "categories/editCategory",
  async ({ categoryId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `admin/edit-category/${categoryId}`,
        updatedData
      );
      return response.data.category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const CategorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    categoryLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All approved categories
      .addCase(getAllCategories.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categories = action.payload;
        state.categories.map((category) => {
          category.image = "category";
        }); //just for pictures / deleted if there picture returned from backend
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload;
      })
      // create category
      .addCase(createCategory.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload;
      })
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload;
      })
      // Edit category
      .addCase(editCategory.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        const updatedCategory = action.payload;
        state.categories = state.categories.map((category) =>
          category._id === updatedCategory._id ? updatedCategory : category
        );
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload;
      });
  },
});

export default CategorySlice.reducer;
