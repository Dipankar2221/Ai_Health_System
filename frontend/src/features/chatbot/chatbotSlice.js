import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ===============================
// 🔥 SEND MESSAGE THUNK
// ===============================
export const sendMessage = createAsyncThunk(
  "chatbot/sendMessage",
  async (message, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "/api/chatbot",
        { message },
        { withCredentials: true }
      );

      // ✅ SAFE PARSE (handles string or object response)
      let data =
        typeof res.data === "string"
          ? JSON.parse(res.data)
          : res.data;

      let reply = data?.reply;

      // ✅ FIX: handle nested object reply
      if (typeof reply === "object") {
        reply = reply?.reply;
      }

      return {
        reply: reply || "Sorry, I couldn't understand.",
        questions: data?.questions || [],
      };

    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Chatbot error" }
      );
    }
  }
);

// ===============================
// 🔹 SLICE
// ===============================
const chatbotSlice = createSlice({
  name: "chatbot",
  initialState: {
    loading: false,
    messages: [],
    error: null,
  },
  reducers: {
    clearChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔄 Pending
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;

        // ✅ add user message instantly
        state.messages.push({
          sender: "user",
          text: action.meta.arg,
        });
      })

      // ✅ Success
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;

        state.messages.push({
          sender: "bot",
          text: action.payload.reply, // ✅ always string now
          questions: action.payload.questions,
        });
      })

      // ❌ Error
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        state.messages.push({
          sender: "bot",
          text: "Something went wrong. Try again.",
        });
      });
  },
});

export const { clearChat } = chatbotSlice.actions;
export default chatbotSlice.reducer;