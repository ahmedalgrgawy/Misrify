import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

export const getMerchantReviews = createAsyncThunk(
    "merchantReviews/getMerchantReviews",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/merchant/reviews");
            return res.data.reviews;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const replyToComment = createAsyncThunk(
    "merchantReviews/replyToComment",
    async ({ commentText, reviewId }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/merchant/create-comment", {
                text: commentText,
                reviewId,
            });
            return res.data.comment;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const merchantReviewsSlice = createSlice({
    name: "merchantReviews",
    initialState: {
        reviews: [],
        loading: false,
        error: null,
        replyLoading: false,
        replyError: null,
    },
    reducers: {
        clearReplyError: (state) => {
            state.replyError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Reviews
            .addCase(getMerchantReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMerchantReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(getMerchantReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reply to Comment
            .addCase(replyToComment.pending, (state) => {
                state.replyLoading = true;
                state.replyError = null;
            })
            .addCase(replyToComment.fulfilled, (state, action) => {
                state.replyLoading = false;
                const newComment = action.payload;
                const review = state.reviews.find((r) =>
                    r.comments.some((c) => c._id === newComment._id)
                );
                if (review) {
                    review.comments.push(newComment);
                }
            })
            .addCase(replyToComment.rejected, (state, action) => {
                state.replyLoading = false;
                state.replyError = action.payload;
            });
    },
});

export const { clearReplyError } = merchantReviewsSlice.actions;
export default merchantReviewsSlice.reducer;