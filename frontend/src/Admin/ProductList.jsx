// src/pages/admin/AdminProductList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify'
import {
  fetchAdminProducts,
  deleteProduct,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";

import { Boxes, Edit, Trash, Star, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {

      dispatch(deleteProduct(id)).then((action)=>{
        if(action.type==='admin/deleteProduct/fulfilled'){
          toast.success("Product Deleted Successfully",{position:'top-center',autoclose:2000})
          dispatch(removeSuccess())
        }
      })
    }
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Admin | All Products" />

      <div className="min-h-screen bg-gray-100 py-16 px-4 md:px-14">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(removeErrors())}
              className="font-bold"
            >
              ✖
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <Boxes className="text-blue-600" size={26} />
          <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : products?.length > 0 ? (
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">SL No</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-semibold">{index + 1}</td>

                    <td className="p-3">
                      <img
                        src={item.image?.[0]?.url}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg shadow"
                      />
                    </td>

                    <td className="p-3 font-medium text-gray-700">
                      {item.name}
                    </td>

                    <td className="p-3 text-gray-600 capitalize">
                      {item.category}
                    </td>

                    <td className="p-3 text-green-700 font-semibold">
                      ₹{item.price}
                    </td>

                    <td className="p-3 flex items-center gap-1">
                      <Star size={16} className="text-yellow-500" />
                      {item.ratings}
                    </td>

                    <td className="p-3">
                      {item.stock > 0 ? (
                        <span className="text-blue-600 font-semibold">
                          {item.stock}
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1 font-semibold">
                          <AlertTriangle size={16} />
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      {new Date(item.createdAt).toLocaleDateString("en-GB")}
                    </td>

                    <td className="p-3 flex gap-4 text-gray-600">

                      {/* EDIT */}
                      <Link
                        to={`/admin/product/update/${item._id}`}
                        className="hover:text-blue-600 transition flex items-center gap-1"
                      >
                        <Edit size={18} /> Edit
                      </Link>

                      {/* DELETE */}
                      <button
                        onClick={() => deleteHandler(item._id)}
                        className="hover:text-red-600 transition flex items-center gap-1"
                      >
                        <Trash size={18} /> Delete
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProductList;
