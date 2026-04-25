import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../features/chatbot/chatbotSlice";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";

const Chatbot = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chatbot);

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ================= SEND MESSAGE =================
  const handleSend = (text = input) => {
    if (!text.trim() || loading) return;

    dispatch(sendMessage(text));
    setInput("");
  };

  return (
    <>
    <PageTitle title="Diabetes" />
      <Navbar /> 
      <div className="flex flex-col h-[80vh] bg-gray-100 p-4">
      
      <h1 className="text-2xl font-bold mb-4 text-center">
        🏥 AI Health Chatbot
      </h1>

      {/* CHAT */}
      <div className="flex-1 bg-white rounded-xl shadow p-4 overflow-y-auto space-y-3">
        
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">
            Start a conversation...
          </p>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="space-y-1">
            
            {/* Message Bubble */}
            <div
              className={`p-2 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {typeof msg.text === "string"
                ? msg.text
                : msg.text?.reply || "Invalid response"}
            </div>

            {/* Suggested Questions */}
            {msg.sender === "bot" &&
              msg.questions?.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="block text-sm text-blue-600 hover:underline ml-1 disabled:opacity-50"
                >
                  👉 {q}
                </button>
              ))}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <p className="text-sm text-gray-500">Typing...</p>
        )}

        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your symptoms..."
          disabled={loading}
        />

        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
    </>
  );
};

export default Chatbot;