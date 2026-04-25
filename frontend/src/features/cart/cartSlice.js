import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ AXIOS INSTANCE
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ================= ADD TO CART =================
export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity, userId }, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/product/${id}`);

      if (!data?.product) {
        throw new Error("Invalid product data");
      }

      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.image?.[0]?.url || "",
        stock: data.product.stock,
        quantity,
        userId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Error adding to cart"
      );
    }
  }
);

// ================= HELPERS =================
const getCartItems = (userId) => {
  if (!userId) return [];
  try {
    const saved = localStorage.getItem(`cartItems_${userId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const getShippingInfo = () => {
  try {
    const saved = localStorage.getItem("shippingInfo");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// ================= SLICE =================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
    success: false,
    message: null,
    shippingInfo: getShippingInfo(),
  },

  reducers: {
    // ✅ Load user cart
    loadCartForUser: (state, action) => {
      const userId = action.payload;
      state.cartItems = getCartItems(userId);
    },

    // ✅ Remove item
    removeCartItem: (state, action) => {
      const { id, userId } = action.payload;

      state.cartItems = state.cartItems.filter(
        (item) => item.product !== id
      );

      localStorage.setItem(
        `cartItems_${userId}`,
        JSON.stringify(state.cartItems)
      );

      state.message = "Item removed from cart";
    },

    // ✅ Clear cart
    clearCart: (state, action) => {
      const userId = action.payload;

      state.cartItems = [];
      localStorage.removeItem(`cartItems_${userId}`);
      localStorage.removeItem("shippingInfo");
    },

    // ✅ Update quantity
    updateQuantity: (state, action) => {
      const { id, quantity, userId } = action.payload;

      const item = state.cartItems.find((i) => i.product === id);

      if (item) {
        item.quantity = quantity;

        localStorage.setItem(
          `cartItems_${userId}`,
          JSON.stringify(state.cartItems)
        );
      }
    },

    // ✅ Save shipping info
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;

      localStorage.setItem(
        "shippingInfo",
        JSON.stringify(action.payload)
      );
    },

    // ✅ Reset states
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        const item = action.payload;
        state.loading = false;

        const existingItem = state.cartItems.find(
          (i) => i.product === item.product
        );

        if (existingItem) {
          existingItem.quantity = item.quantity;
        } else {
          state.cartItems.push(item);
        }

        localStorage.setItem(
          `cartItems_${item.userId}`,
          JSON.stringify(state.cartItems)
        );

        state.success = true;
        state.message = `${item.name} added to cart`;
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  loadCartForUser,
  removeCartItem,
  clearCart,
  updateQuantity,
  removeErrors,
  removeMessage,
  saveShippingInfo,
} = cartSlice.actions;

export default cartSlice.reducer;