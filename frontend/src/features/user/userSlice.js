import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ AXIOS INSTANCE (IMPORTANT)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ===================== REGISTER =====================
export const register = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ===================== LOGIN =====================
export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/login", { email, password });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// ===================== LOAD USER =====================
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/me");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load user"
      );
    }
  }
);

// ===================== LOGOUT =====================
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/logout");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

// ===================== UPDATE PROFILE =====================
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/api/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Update profile failed"
      );
    }
  }
);

// ===================== UPDATE PASSWORD =====================
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/api/password/update", formData, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Update password failed"
      );
    }
  }
);

// ===================== FORGOT PASSWORD =====================
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/password/forgot", { email });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset link"
      );
    }
  }
);

// ===================== RESET PASSWORD =====================
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        `/api/password/reset/${token}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Reset password failed"
      );
    }
  }
);

// ===================== INITIAL STATE =====================
const initialState = {
  user: (() => {
    try {
      const u = localStorage.getItem("user");
      return u && u !== "undefined" ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  loading: false,
  error: null,
  success: false,
  message: null,
};

// ===================== SLICE =====================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // ================= REGISTER =================
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
        state.isAuthenticated = true;
        state.success = true;

        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", "true");
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // ================= LOGIN =================
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
        state.isAuthenticated = true;
        state.success = true;

        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", "true");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // ================= LOAD USER =================
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
        state.isAuthenticated = true;

        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", "true");
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;

        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      });

    // ================= LOGOUT =================
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    });

    // ================= UPDATE PROFILE =================
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
        state.success = true;

        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ================= UPDATE PASSWORD =================
    builder
      .addCase(updatePassword.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ================= FORGOT PASSWORD =================
    builder
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload?.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ================= RESET PASSWORD =================
    builder
      .addCase(resetPassword.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;