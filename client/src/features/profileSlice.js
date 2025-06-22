import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Get Profile Details
export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/profile");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);



// Edit Profile Details
export const editProfile = createAsyncThunk(
  "profile/editProfile",
  async ( updatedData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/user/update`,
        updatedData
      );
      return response.user; //error back from backend
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const ProfileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: {},
    Loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Profile details
      .addCase(getProfile.pending, (state) => {
        state.Loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.Loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.Loading = false;
        state.error = action.payload;
      })
      // Edit Profile details
      .addCase(editProfile.pending, (state) => {
        state.Loading = true;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.Loading = false;
        state.profile = action.payload; //don't store the backend error in the profile
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.Loading = false;        
        state.error = action.payload;
      });
  },
});

export default ProfileSlice.reducer;
