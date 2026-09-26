import { createSlice } from "@reduxjs/toolkit";

export const ReviewSlice = createSlice({
  name: "Review",
  initialState: {
    data: []
  },

  reducers: {
    addReview(state, action) {
      state.data.push(action.payload);
    },

    deleteReview(state, action) {
      state.data = state.data.filter((review) => review.id !== action.payload);
    },

    clearReviews(state) {
      state.data = [];
    }
  }
});

export const { addReview, deleteReview, clearReviews } = ReviewSlice.actions;

export default ReviewSlice.reducer;
