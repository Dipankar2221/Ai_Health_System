import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, deleteUser, fetchUsers, removeErrors } from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import { Delete, Edit } from "@mui/icons-material";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error,message } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handleDelete=(id)=>{
    const confirm=window.confirm('Are You sure you Want to delete this user')
    if(confirm){
      dispatch(deleteUser(id))
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }

    if(message){
      toast.success(message,{position:'top-center',autoClose:3000});
      dispatch(clearMessage())
      navigate('/admin/dashboard')
    }
  }, [dispatch, error,message]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="All Users" />

          <div className="px-4 md:px-10 py-8 mt-10">
            <h1 className="text-3xl font-semibold mb-6 text-center">
              All Registered Users
            </h1>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left border">Sl No</th>
                    <th className="p-3 text-left border">Name</th>
                    <th className="p-3 text-left border">Email</th>
                    <th className="p-3 text-left border">Role</th>
                    <th className="p-3 text-left border">Created At</th>
                    <th className="p-3 text-center border">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users && users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="p-3 border">{index + 1}</td>
                        <td className="p-3 border capitalize">{user.name}</td>
                        <td className="p-3 border">{user.email}</td>
                        <td className="p-3 border">{user.role}</td>
                        <td className="p-3 border">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 border text-center space-x-3">
                          <Link
                            to={`/admin/getUser/${user._id}`}
                            className="text-blue-600"
                          >
                           <Edit/>
                          </Link>
                          <button 
                          onClick={()=>handleDelete(user._id)}
                          className="text-red-600">
                            <Delete/>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center p-4 font-medium text-gray-600"
                      >
                        No Users Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default UserList;
