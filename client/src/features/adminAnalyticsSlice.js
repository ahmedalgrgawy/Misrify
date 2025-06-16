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
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/orders-sales");
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

const adminAnalyticsSlice = createSlice({
    name:"adminAnalytics",
    initialState:{
        platformStats: {},
        ordersSales:{},
        TotalUsers:{},
        loading:false,
        message:"",
        error:null,
    },
    reducers:{},
    extraReducers:(builder) => {
        builder
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
          .addCase(getTotalUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getTotalUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.TotalUsers = action.payload.data;
          })
          .addCase(getTotalUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
    }
})

export default adminAnalyticsSlice.reducer;
