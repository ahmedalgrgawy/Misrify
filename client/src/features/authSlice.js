import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

// Signup
export const signup = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

// Login
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return rejectWithValue("Your account is not verified. Please verify your account before logging in.");
    }
    return rejectWithValue(error.response?.data);
  }
});

// Verify Account
export const verifyAccount = createAsyncThunk('auth/verify-email', async ({ email, otp }, { rejectWithValue }) => {
  try {
    console.log(email, otp);

    const response = await axiosInstance.post('/auth/verify-email', { email, otp });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

// Step 1: Send password reset email
export const sendResetEmail = createAsyncThunk("auth/sendResetEmail", async (email, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return response.data.message;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Error sending reset email.");
  }
});

// Step 2: Reset password with token
export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
    return response.data.message;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Error resetting password.");
  }
});



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    verified: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('accessToken');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Verify
      .addCase(verifyAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAccount.fulfilled, (state) => {
        state.loading = false;
        state.verified = true;
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Resent Email
      .addCase(sendResetEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(sendResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
