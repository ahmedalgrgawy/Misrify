import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Get All Brands
export const getAllBrands = createAsyncThunk(
  "brands/getAllBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/brands");
      return response.data.Brands;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// create Brand
export const createBrand = createAsyncThunk(
  "brands/createBrand",
  async (newBrand, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`admin/create-brand`, newBrand);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete Brand
export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (brandId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/delete-brand/${brandId}`);
      return brandId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Edit Brand
export const editBrand = createAsyncThunk(
  "brands/editBrand",
  async ({ brandId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/edit-brand/${brandId}`, updatedData);
      return response.data.brand;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const BrandSlice = createSlice({
  name: "brands",
  initialState: {
    brands: [],
    brandLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All approved brands
      .addCase(getAllBrands.pending, (state) => {
        state.brandLoading = true;
        state.error = null;
      })
      .addCase(getAllBrands.fulfilled, (state, action) => {
        state.brandLoading = false;
        state.brands = action.payload;
      })
      .addCase(getAllBrands.rejected, (state, action) => {
        state.brandLoading = false;
        state.error = action.payload;
      })
      // create brand
      .addCase(createBrand.pending, (state) => {
        state.brandLoading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brandLoading = false;
        state.brands = action.payload;
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.brandLoading = false;
        state.error = action.payload;
      })
      // Delete brand
      .addCase(deleteBrand.pending, (state) => {
        state.brandLoading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brandLoading = false;
        state.brands = state.brands.filter(
          (brand) => brand._id !== action.payload
        );
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.brandLoading = false;
        state.error = action.payload;
      })
      // Edit brand
      .addCase(editBrand.pending, (state) => {
        state.brandLoading = true;
        state.error = null;
      })
      .addCase(editBrand.fulfilled, (state, action) => {
        state.brandLoading = false;
        // Update the brand in the state
        const updatedBrand = action.payload;
        state.brands = state.brands.map((brand) =>
          brand._id === updatedBrand._id ? updatedBrand : brand
        );
      })
      .addCase(editBrand.rejected, (state, action) => {
        state.brandLoading = false;
        state.error = action.payload;
      });
  },
});

export default BrandSlice.reducer;
