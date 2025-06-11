import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

// Signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser", 
  async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData);
    return { user: response.data?.user?._id };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// Verify Account
export const verifyAccount = createAsyncThunk(
  "auth/verify-email",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/verify-email", { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Verification failed");
    }
  }
);

// Send Reset Email
export const sendResetEmail = createAsyncThunk(
  "auth/sendResetEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error sending reset email.");
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error resetting password.");
    }
  }
);

// Check Authentication 
export const checkAuth = createAsyncThunk("auth/check-auth", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/auth/check-auth");
    return response.data;
  } catch (error) {
    return rejectWithValue("Not authenticated");
  }
});

// Logout 
export const logoutUser = createAsyncThunk( "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout());
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    verified: false,
    isAuthenticated: false,
    accessToken: null,
    otp: null,
    hasCheckedAuth: false
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
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
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
         localStorage.setItem('token',  JSON.stringify(action.payload.token));
         localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Verify Account
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
        state.error = action.payload;
      })
      // Send Reset Email
      .addCase(sendResetEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetEmail.fulfilled, (state) => {
        state.loading = false;
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
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Authentication
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.hasCheckedAuth = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.hasCheckedAuth = true;
      })
      //Logout 
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.hasCheckedAuth = true;
      });
  },
});

export const { logout, setAccessToken, setOtp, clearError } = authSlice.actions;
export default authSlice.reducer;
