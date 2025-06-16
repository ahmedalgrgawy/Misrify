import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Get stock level for all products
export const getStockLevelsProducts = createAsyncThunk(
  "merchantAnalytics/getStockLevelsProducts",  
  async(_,{rejectWithValue}) => {
    try{
        const res = await axiosInstance.get("/merchant/stock-level");
        return res.data.products;
    }catch(error){
        return rejectWithValue(error.response?.data || error.message);
    }
  }
)

// Get Products and Average Ratings
export const getProductsAvgRatings = createAsyncThunk(
    "merchantAnalytics/getProductsAvgRatings",  
    async(_,{rejectWithValue}) => {
      try{
          const res = await axiosInstance.get("/merchant/products-with-ratings");
          return res.data.products;
      }catch(error){
          return rejectWithValue(error.response?.data || error.message);
      }
    }
  )

// Get merchant orders stats
export const getMerchantOrderStats = createAsyncThunk(
    "merchantAnalytics/getMerchantOrderStats",  
    async(_,{rejectWithValue}) => {
      try{
          const res = await axiosInstance.get("/merchant/merchant-orders-stats");
          return {
            totalOrders : res.data.totalOrders,
            totalMoneyEarned : res.data.totalMoneyEarned,
          }
      }catch(error){
          return rejectWithValue(error.response?.data || error.message);
      }
    }
  )

 // Get Sales Growth
 export const getSalesGrowth = createAsyncThunk(
    "merchantAnalytics/getSalesGrowth",  
    async(_,{rejectWithValue}) => {
      try{
          const res = await axiosInstance.get("/merchant/sales-growth");
          return {
            currentMonthTotal : res.data.currentMonthTotal,
            lastMonthTotal : res.data.lastMonthTotal,
            salesGrowthRate: res.data.salesGrowthRate,
          }
      }catch(error){
          return rejectWithValue(error.response?.data || error.message);
      }
    }
  )

const merchantAnalyticsSlice = createSlice({
    name:"merchantAnalytics",
    initialState:{
        stockLevels:[] ,
        productRatings:[],
        orderStats:{
            totalOrders: 0,
            totalMoneyEarned: 0, 
        },
        salesGrowth: {
            currentMonthTotal: 0,
            lastMonthTotal: 0,
            salesGrowthRate: "0.00",
          },
        //   orderStats: null, // or { totalOrders: null, totalMoneyEarned: null } if partial access is needed
        //   salesGrowth: null,
          loading: false,
          error: null,
    },
    reducers:{},
    extraReducers:(builder) => {
        builder
        // Stock levels
        .addCase(getStockLevelsProducts.pending, (state) => {
          state.loading = true;
        })
        .addCase(getStockLevelsProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.stockLevels = action.payload;
        })
        .addCase(getStockLevelsProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        // Products and Average Ratings
        .addCase(getProductsAvgRatings.pending, (state) => {
          state.loading = true;
        })
        .addCase(getProductsAvgRatings.fulfilled, (state, action) => {
          state.loading = false;
          state.productRatings = action.payload;
        })
        .addCase(getProductsAvgRatings.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        // Order stats
        .addCase(getMerchantOrderStats.pending, (state) => {
          state.loading = true;
        })
        .addCase(getMerchantOrderStats.fulfilled, (state, action) => {
          state.loading = false;
          state.orderStats = action.payload;
        })
        .addCase(getMerchantOrderStats.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        // Sales growth
        .addCase(getSalesGrowth.pending, (state) => {
          state.loading = true;
        })
        .addCase(getSalesGrowth.fulfilled, (state, action) => {
          state.loading = false;
          state.salesGrowth = action.payload;
        })
        .addCase(getSalesGrowth.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });

export default merchantAnalyticsSlice.reducer;