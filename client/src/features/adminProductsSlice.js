import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Get All approved Products
export const getAllProducts = createAsyncThunk("products/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/products");
      return response.data.Products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// Admin Create Product
export const createProduct = createAsyncThunk("products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/admin/create-product`, productData);
      return res.data.Product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/delete-product/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Edit Product
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ productId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `admin/edit-product/${productId}`,
        updatedData
      );
      // return response.data.Product;
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All approved Products
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit Product
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        // state.products = state.products.map((product) =>
        //   product._id === updatedProduct._id ? updatedProduct : product
        // );
        if (updatedProduct && updatedProduct._id) {
          const index = state.products.findIndex(product => product._id === updatedProduct._id);
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        // state.products.push(action.payload);
        if (action.payload) {
          state.products.push(action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default productsSlice.reducer;
