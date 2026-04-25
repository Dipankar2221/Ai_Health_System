import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteProductReviews,
  fetchAdminProducts,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";

const ReviewsList = () => {
  const { products, loading, error, success, message } = useSelector(
    (state) => state.admin
  );

  const [selectedProduct, setSelectedProduct] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // Delete Review Handler
  const handleDeleteReview = (productId, reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (confirmDelete) {
      dispatch(deleteProductReviews({ productId, reviewId })).then((res) => {
        if (res.payload?.success) {
          // Re-fetch products to update UI
          dispatch(fetchAdminProducts());
          setSelectedProduct(null);
        }
      });
    }
  };

  // Toast & cleanup
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 2500 });
      dispatch(removeErrors());
    }

    if (success) {
      toast.success(message, { position: "top-center", autoClose: 2500 });
      dispatch(removeSuccess());
      dispatch(clearMessage());
    }
  }, [dispatch, error, success, message]);

  if (loading) return <h1 className="text-center text-xl py-20">Loading...</h1>;

  return (
    <>
      <Navbar />
      <PageTitle title="Product Reviews" />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-indigo-600">All Products</h1>

        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="w-full text-left bg-white">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-3">Sl No</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Product Image</th>
                <th className="p-3">Reviews</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {products?.map((product, index) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">
                    <img
                      src={product.image?.[0]?.url}
                      alt={product.name}
                      className="w-14 h-14 rounded object-cover border"
                    />
                  </td>
                  <td className="p-3">{product.reviews.length}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-md transition"
                    >
                      View Reviews
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedProduct && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-500">
              Reviews for: {selectedProduct.name}
            </h2>

            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
              <table className="w-full bg-white">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="p-3">Sl No</th>
                    <th className="p-3">Reviewer Name</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Comment</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.reviews.length > 0 ? (
                    selectedProduct.reviews.map((review, index) => (
                      <tr
                        key={review._id}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">{review.name}</td>
                        <td className="p-3">{review.rating}</td>
                        <td className="p-3">{review.comment}</td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              handleDeleteReview(selectedProduct._id, review._id)
                            }
                            className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded shadow"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500">
                        No Reviews Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ReviewsList;
