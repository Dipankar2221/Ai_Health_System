import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ AXIOS INSTANCE (MUST)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 📌 CREATE ORDER
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/new/order", order, {
        headers: { "Content-Type": "application/json" },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Order creation failed"
      );
    }
  }
);

// 📌 GET MY ORDERS
export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/orders/user");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// 📌 GET ORDER DETAILS
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

// ================= SLICE =================
const orderSlice = createSlice({
  name: "order",
  initialState: {
    success: false,
    loading: false,
    error: null,
    orders: [],
    order: {},
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= CREATE ORDER =================
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload?.order;
        state.success = action.payload?.success;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET MY ORDERS =================
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload?.orders;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= ORDER DETAILS =================
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload?.order;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { removeErrors, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer;