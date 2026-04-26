import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


// ===============================
// 🔥 SINGLE DYNAMIC THUNK
// ===============================
export const predictDisease = createAsyncThunk(
  "prediction/predictDisease",
  async ({ type, data }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        `/api/predict/${type}`,   // 🔥 dynamic endpoint
        data,
        { withCredentials: true }
      );

      return {
        type,
        data: res.data,
      };

    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Prediction failed" }
      );
    }
  }
);

// ===============================
// 🔹 SLICE
// ===============================
const predictionSlice = createSlice({
  name: "prediction",
  initialState: {
    loading: false,
    results: {}, // 🔥 store all predictions separately
    error: null,
  },
  reducers: {
    clearPrediction: (state) => {
      state.results = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(predictDisease.pending, (state) => {
        state.loading = true;
      })
      .addCase(predictDisease.fulfilled, (state, action) => {
        state.loading = false;

        const { type, data } = action.payload;

        // 🔥 store result by type
        state.results[type] = data;
      })
      .addCase(predictDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPrediction } = predictionSlice.actions;
export default predictionSlice.reducer;