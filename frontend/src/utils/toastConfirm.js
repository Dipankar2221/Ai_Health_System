// src/utils/toastConfirm.js
import { toast } from "react-toastify";
import React from "react";

export const toastConfirm = (message, onConfirm) => {
  toast(
    ({ closeToast }) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">{message}</p>
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={() => {
              onConfirm(); // run delete
              closeToast(); // close toast
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Yes
          </button>
          <button
            onClick={closeToast}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            No
          </button>
        </div>
      </div>
    ),
    { autoClose: false }
  );
};
