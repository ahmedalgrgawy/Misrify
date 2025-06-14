import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

export const getAllNotifications = createAsyncThunk(
    "notifications/getAllNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/user/notification");
            return response.data.notifications;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const markAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.put(`/user/notification/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/user/notification/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteAllNotifications = createAsyncThunk(
    'notifications/deleteAll',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.delete('/user/notification');
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        notificationsLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllNotifications.pending, (state) => {
                state.notificationsLoading = true;
                state.error = null;
            })
            .addCase(getAllNotifications.fulfilled, (state, action) => {
                state.notificationsLoading = false;
                state.notifications = action.payload; 
            })
            .addCase(getAllNotifications.rejected, (state, action) => {
                state.notificationsLoading = false;
                state.error = action.payload;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const id = action.payload;
                const notification = state.notifications.find((n) => n._id === id);
                if (notification) {
                    notification.isRead = true;
                }
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.error = action.payload; 
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const id = action.payload;
                state.notifications = state.notifications.filter((n) => n._id !== id);
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.error = action.payload; 
            })
            .addCase(deleteAllNotifications.fulfilled, (state) => {
                state.notifications = [];
            })
            .addCase(deleteAllNotifications.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export default notificationSlice.reducer;