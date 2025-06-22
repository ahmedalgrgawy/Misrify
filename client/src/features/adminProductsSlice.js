import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Get Requested Products
export const getRequestedProducts = createAsyncThunk(
  "products/getRequestedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/requested-products");
      return response.data.requestedProducts;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Get All approved Products
export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
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
export const createProduct = createAsyncThunk(
  "products/createProduct",
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Toggle Product Approval
export const toggleProductApproval = createAsyncThunk(
  "products/toggleProductApproval",
  async ({ productId, isApproved }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/admin/toggle-product/${productId}`,
        { isApproved }
      );
      return response.data.Product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    requestedProducts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Requested Products
      .addCase(getRequestedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequestedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.requestedProducts = action.payload;
      })
      .addCase(getRequestedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
        state.requestedProducts = state.requestedProducts.filter(
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
        if (updatedProduct && updatedProduct._id) {
          const index = state.products.findIndex(product => product._id === updatedProduct._id);
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
          const reqIndex = state.requestedProducts.findIndex(product => product._id === updatedProduct._id);
          if (reqIndex !== -1) {
            state.requestedProducts[reqIndex] = updatedProduct;
          }
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products.push(action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Product Approval
      .addCase(toggleProductApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleProductApproval.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        if (updatedProduct && updatedProduct._id) {
          // Update requested products
          const reqIndex = state.requestedProducts.findIndex(product => product._id === updatedProduct._id);
          if (reqIndex !== -1) {
            if (updatedProduct.isApproved) {
              // If approved, remove from requested and add to products
              state.requestedProducts.splice(reqIndex, 1);
              state.products.push(updatedProduct);
            } else {
              // Update in requested products
              state.requestedProducts[reqIndex] = updatedProduct;
            }
          }
          // Update products if the product is already there
          const prodIndex = state.products.findIndex(product => product._id === updatedProduct._id);
          if (prodIndex !== -1) {
            if (!updatedProduct.isApproved) {
              // If rejected, remove from products
              state.products.splice(prodIndex, 1);
            } else {
              // Update in products
              state.products[prodIndex] = updatedProduct;
            }
          }
        }
      })
      .addCase(toggleProductApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;