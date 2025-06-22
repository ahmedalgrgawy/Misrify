import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Merchant Get Products
export const getMerchantProducts = createAsyncThunk(
  "merchantProducts/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/merchant/products");
      return res.data.merchantProducts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

// Merchant Delete Product
export const deleteMerchantProduct = createAsyncThunk(
  "merchantProducts/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/merchant/delete-product/${productId}`);
      return productId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete product");
    }
  }
);

// Merchant Edit Product (fixed endpoint)
export const editMerchantProduct = createAsyncThunk(
  "merchantProducts/editProduct",
  async ({ productId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/merchant/edit-product/${productId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to edit product");
    }
  }
);

// Merchant Create Product
export const createMerchantProduct = createAsyncThunk(
  "merchantProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/merchant/create-product`, productData);
      return res.data.merchantProducts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create product");
    }
  }
);

const merchantProductsSlice = createSlice({
  name: "merchantProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get
      .addCase(getMerchantProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMerchantProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getMerchantProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createMerchantProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMerchantProduct.fulfilled, (state, action) => {
        state.loading = false;
        // state.products.push(action.payload);
        if (action.payload) {
          state.products.push(action.payload);
        }
      })
      .addCase(createMerchantProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteMerchantProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMerchantProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteMerchantProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit
      .addCase(editMerchantProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editMerchantProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        // state.products = state.products.map(product =>
        //   product._id === updatedProduct._id ? updatedProduct : product
        // );
        if (updatedProduct && updatedProduct._id) {
          const index = state.products.findIndex(product => product._id === updatedProduct._id);
          if (index !== -1) {
              state.products[index] = updatedProduct;
          }
      }
      })
      .addCase(editMerchantProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default merchantProductsSlice.reducer;
