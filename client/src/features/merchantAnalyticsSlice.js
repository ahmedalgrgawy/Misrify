import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import { getYearlyIncome } from "./adminAnalyticsSlice";

export const getStockLevelsProducts = createAsyncThunk(
  "merchantAnalytics/getStockLevelsProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/merchant/stock-level");
      return res.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProductsAvgRatings = createAsyncThunk(
  "merchantAnalytics/getProductsAvgRatings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/merchant/products-with-ratings");
      return res.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getMerchantOrderStats = createAsyncThunk(
  "merchantAnalytics/getMerchantOrderStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/merchant/merchant-orders-stats");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSalesGrowth = createAsyncThunk(
  "merchantAnalytics/getSalesGrowth",
  async ({ period = "monthly" }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/merchant/sales-growth?period=${period}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getMerchantSalesTrends = createAsyncThunk(
  "merchantAnalytics/getMerchantSalesTrends",
  async ({ year = new Date().getFullYear() }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/merchant/sales-trends?year=${year}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getMerchantOrderTrends = createAsyncThunk(
  "merchantAnalytics/getMerchantOrderTrends",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/merchant/order-trends");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getMerchantOrders = createAsyncThunk(
  "merchantOrders/getMerchantOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/merchant/orders");
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const merchantAnalyticsSlice = createSlice({
  name: "merchantAnalytics",
  initialState: {
    stockLevels: [],
    productRatings: [],
    orderStats: { totalOrders: 0, totalMoneyEarned: 0 },
    salesGrowth: { currentMonthTotal: 0, lastMonthTotal: 0, salesGrowthRate: "0.00" },
    salesTrends: [],
    orderTrends: [],
    yearlyIncome: {},
    totalViewers: {},
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Stock Levels
      .addCase(getStockLevelsProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStockLevelsProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.stockLevels = action.payload;
      })
      .addCase(getStockLevelsProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Product Ratings
      .addCase(getProductsAvgRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsAvgRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.productRatings = action.payload;
      })
      .addCase(getProductsAvgRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Order Stats
      .addCase(getMerchantOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMerchantOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStats = action.payload;
      })
      .addCase(getMerchantOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sales Growth
      .addCase(getSalesGrowth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesGrowth.fulfilled, (state, action) => {
        state.loading = false;
        state.salesGrowth = action.payload;
      })
      .addCase(getSalesGrowth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sales Trends
      .addCase(getMerchantSalesTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMerchantSalesTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.salesTrends = action.payload;
      })
      .addCase(getMerchantSalesTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Order Trends
      .addCase(getMerchantOrderTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMerchantOrderTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.orderTrends = action.payload;
      })
      .addCase(getMerchantOrderTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Yearly Income
      .addCase(getYearlyIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getYearlyIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.yearlyIncome = action.payload.data;
      })
      .addCase(getYearlyIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(getMerchantOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMerchantOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMerchantOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default merchantAnalyticsSlice.reducer;