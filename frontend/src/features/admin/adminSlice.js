import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ AXIOS INSTANCE (VERY IMPORTANT)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* ================= FETCH ADMIN PRODUCTS ================= */
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/admin/products");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching products"
      );
    }
  }
);

/* ================= CREATE PRODUCT ================= */
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post(
        "/api/admin/product/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating product"
      );
    }
  }
);

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        `/api/admin/product/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating product"
      );
    }
  }
);

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/api/admin/product/delete/${id}`);
      return { ...data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting product"
      );
    }
  }
);

/* ================= USERS ================= */
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/admin/getUser`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const getSingleUser = createAsyncThunk(
  "admin/getSingleUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/admin/getUser/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        `/api/admin/getUser/${id}`,
        { role },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update role"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/api/admin/getUser/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

/* ================= ORDERS ================= */
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/admin/orders`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/api/admin/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        `/api/admin/order/${id}`,
        { status },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order"
      );
    }
  }
);

/* ================= REVIEWS ================= */
export const fetchProductReviews = createAsyncThunk(
  "admin/fetchProductReviews",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/admin/reviews?id=${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

export const deleteProductReviews = createAsyncThunk(
  "admin/deleteProductReviews",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(
        `/api/admin/reviews?productId=${productId}&id=${reviewId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

/* =============================
   MERGED ADMIN SLICE
============================= */
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    newProduct: null,
    updatedProduct: null,
    loading: false,
    error: null,
    success: false,
    product:{},
    deleting:{},
    users:[],
    user:{},
    message:null,
    orders:[],
    totalAmount:0,
    order:{},
    reviews:[]
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    clearMessage:(state)=>{
      state.message=null
    }
  },

  extraReducers: (builder) => {
    builder
      /* ========= FETCH PRODUCTS ========= */
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      /* ========= CREATE PRODUCT ========= */
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.newProduct = action.payload.product;
        state.products.push(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      /* ========= UPDATE PRODUCT ========= */
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.product=action.payload.product
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      /* ========= DELETE PRODUCT ========= */
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const deletedId = action.payload.id;

        state.products = state.products.filter(
          (item) => item._id !== deletedId
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
        //fetchusers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users=action.payload.users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

         //fetch Single users
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user=action.payload.user
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

        //update user role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success=action.payload.success;
        state.user=action.payload.user;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

       .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error=null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message=action.payload.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error=null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders=action.payload.orders;
        state.totalAmount=action.payload.totalAmount
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message=action.payload.message
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

       .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.order=action.payload.order
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews=action.payload.reviews
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(deleteProductReviews.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(deleteProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.success=action.payload.success
        state.message=action.payload.message
      })
      .addCase(deleteProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
  },
});

export const { removeErrors, removeSuccess,clearMessage } = adminSlice.actions;

export default adminSlice.reducer;
