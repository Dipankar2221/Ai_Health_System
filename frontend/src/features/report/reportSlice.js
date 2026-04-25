import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ===============================
// 🔥 CREATE AI REPORT
// ===============================
export const createAIReport = createAsyncThunk(
  "report/createAIReport",
  async ({ disease, prediction, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `/api/reports/ai-report/${disease}`, // ✅ dynamic disease param
        { prediction, formData },
        { withCredentials: true }
      );

      return res.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Report creation failed" }
      );
    }
  }
);

// ===============================
// 🔥 GET ALL REPORTS
// ===============================
export const getReports = createAsyncThunk(
  "report/getReports",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/reports", {
        withCredentials: true,
      });

      return res.data;

    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ===============================
// 🔥 DASHBOARD
// ===============================
export const getDashboard = createAsyncThunk(
  "report/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/reports/reportDashboard", {
        withCredentials: true,
      });

      return res.data;

    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ===============================
// 🔥 RECOMMENDATION
// ===============================
export const getRecommendation = createAsyncThunk(
  "report/getRecommendation",
  async ({ type, prediction, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/api/reports/ai/recommendation",
        { type, prediction, formData },
        { withCredentials: true }
      );

      return res.data;

    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ===============================
// 🔥 DELETE REPORT
// ===============================
export const deleteReport = createAsyncThunk(
  "report/deleteReport",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/reports/${id}`, {
        withCredentials: true,
      });

      return id;

    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ===============================
// 🔹 SLICE
// ===============================
const reportSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    reports: [],
    dashboard: null,
    recommendation: null,
    pdfUrl: null,
    error: null,
  },
  reducers: {
    clearReportState: (state) => {
      state.error = null;
      state.pdfUrl = null;
      state.recommendation = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ================= CREATE REPORT =================
      .addCase(createAIReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAIReport.fulfilled, (state, action) => {
        state.loading = false;
        state.pdfUrl = action.payload.pdfUrl;
        state.reports.unshift(action.payload.record); // add new report
      })
      .addCase(createAIReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET REPORTS =================
      .addCase(getReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= DASHBOARD =================
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      })

      // ================= RECOMMENDATION =================
      .addCase(getRecommendation.fulfilled, (state, action) => {
        state.recommendation = action.payload.answer;
      })

      // ================= DELETE =================
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(
          (r) => r._id !== action.payload
        );
      });
  },
});

export const { clearReportState } = reportSlice.actions;
export default reportSlice.reducer;