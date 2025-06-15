import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

// User Profile 
export const userProfile = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/profile");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Get all users
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/users");
      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Get all merchants
export const getAllMerchants = createAsyncThunk(
  "admin/getAllMerchants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/merchants");
      return response.data.merchants;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/delete-user/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Edit User
export const editUser = createAsyncThunk(
  "admin/editUser",
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/edit-user/${userId}`, updatedData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// create user 
export const createUser = createAsyncThunk(
  "admin/createUser",
  async (newUserData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admin/create-user", newUserData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    users: [],
    merchants: [],
    loading: false,
    error: null,
    usersLoading: false,
    usersError: null,
    merchantsLoading: false,
    merchantsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // User Profile
      .addCase(userProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Users
      .addCase(getAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      // Merchants
      .addCase(getAllMerchants.pending, (state) => {
        state.merchantsLoading = true;
        state.merchantsError = null;
      })
      .addCase(getAllMerchants.fulfilled, (state, action) => {
        state.merchantsLoading = false;
        state.merchants = action.payload;
      })
      .addCase(getAllMerchants.rejected, (state, action) => {
        state.merchantsLoading = false;
        state.merchantsError = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
        state.merchants = state.merchants.filter(merchant => merchant._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit User
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user in the state
        const updatedUser = action.payload;
        state.users = state.users.map(user =>
          user._id === updatedUser._id ? updatedUser : user
        );
        state.merchants = state.merchants.map(merchant =>
          merchant._id === updatedUser._id ? updatedUser : merchant
        );
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        // const newUser = action.payload;
        // // Add to appropriate array based on role
        // if (newUser.role === 'merchant') {
        //   state.merchants.push(newUser);
        // } else {
        //   state.users.push(newUser);
        // }
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default userSlice.reducer; 