import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

export const getAllContactMessages = createAsyncThunk(
    "messages/getAllContactMessages",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get("/admin/contact-messages");
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message);
      }
    }
  );
  
const messageSlice = createSlice({
    name:"messages",
    initialState:{
        messages: [],
        messageLoading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(getAllContactMessages.pending, (state) => {
            state.messageLoading = true;
            state.error = null;
        })
        .addCase(getAllContactMessages.fulfilled, (state, action) => {
            state.messageLoading = false;
            state.messages = action.payload;
        })
        .addCase(getAllContactMessages.rejected, (state, action) => {
            state.messageLoading = false;
            state.error = action.payload;
        });
    }
})

export default messageSlice.reducer; 