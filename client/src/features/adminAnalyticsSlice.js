import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

export const getPlatformStats = createAsyncThunk(
  "adminAnalytics/getPlatformStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/platform-stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getOrdersSales = createAsyncThunk(
  "adminAnalytics/getOrdersSales",
  async ({ period = "monthly" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/orders-sales?period=${period}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getTotalUsers = createAsyncThunk(
  "adminAnalytics/getTotalUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/total-users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getMiniChartData = createAsyncThunk(
  "adminAnalytics/getMiniChartData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/mini-chart-data");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getYearlyIncome = createAsyncThunk(
  "analytics/getYearlyIncome",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/yearly-income");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState: {
    platformStats: {},
    ordersSales: {},
    totalUsers: {},
    miniChartData: {},
    yearlyIncome: {},
    totalViewers: {},
    loading: false,
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Platform Stats
      .addCase(getPlatformStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlatformStats.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.platformStats = action.payload.stats;
      })
      .addCase(getPlatformStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Orders and Sales
      .addCase(getOrdersSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersSales.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.ordersSales = action.payload.data;
      })
      .addCase(getOrdersSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Total Users
      .addCase(getTotalUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.totalUsers = action.payload.data;
      })
      .addCase(getTotalUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mini Chart Data
      .addCase(getMiniChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMiniChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.miniChartData = action.payload.data;
      })
      .addCase(getMiniChartData.rejected, (state, action) => {
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
        state.message = action.payload.message;
        state.yearlyIncome = action.payload.data;
      })
      .addCase(getYearlyIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default adminAnalyticsSlice.reducer;