import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getSingleUser,
  updateUserRole,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";

const UpdateRole = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, success, loading, error } = useSelector(
    (state) => state.admin
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const { name, email, role } = formData;

  // Fetch single user
  useEffect(() => {
    dispatch(getSingleUser(id));
  }, [dispatch, id]);

  // Update local state when single user is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

  console.log(user)

  // Handle error & success alerts
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
    if (success) {
      toast.success("Role Updated Successfully");
      dispatch(removeSuccess());
      navigate("/admin/getUser");
    }
  }, [error, success, dispatch, navigate]);

  // Submit
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserRole({ id, role }));
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Update User Role" />

      <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
        <div className="p-8 shadow-xl bg-white rounded-2xl w-full max-w-xl border border-gray-200">
          
          <h1 className="text-2xl font-bold mb-6 text-center">
            Update User Role
          </h1>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                value={name}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Role</label>
              <select
                value={role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white rounded-lg transition-all ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Updating..." : "Update Role"}
            </button>
          </form>

          <button
            onClick={() => navigate("/admin/getUser")}
            className="mt-4 w-full border border-gray-400 text-gray-800 py-2 rounded-lg hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateRole;
