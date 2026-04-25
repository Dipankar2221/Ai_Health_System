import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus, removeErrors, removeSuccess } from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import { getOrderDetails } from "../features/order/orderSlice";

const UpdateOrder = () => {
  const [status, setStatus] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();

  const { order, loading: orderLoading } = useSelector((state) => state.order);
  const { success, loading: adminLoading, error } = useSelector((state) => state.admin);

  const loading = orderLoading || adminLoading;

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Order Status Updated Successfully");
      dispatch(removeSuccess());
    }
  }, [error, success, dispatch]);

  const { shippingInfo = {}, orderItems = [], paymentInfo = {}, orderStatus, totalPrice } = order || {};

  const paymentStatus = paymentInfo?.status === "succeeded" ? "Paid" : "Not Paid";
  const finalOrderStatus = paymentStatus === "Not Paid" ? "Cancelled" : orderStatus;

  const handleUpdate = () => {
    if (!status) return toast.error("Please select status");
    dispatch(updateOrderStatus({ id, status }));
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Update Order" />

      <div className="max-w-5xl mx-auto py-20 px-4 space-y-10">

        <h1 className="text-3xl text-center font-bold text-gray-800 mb-4">Update Order</h1>

        {/* Order Information */}
        <div className="bg-white shadow-lg rounded-xl p-6 border">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Order Information</h2>

          <div className="space-y-2 text-gray-700">
            <p><strong>Order ID:</strong> {id}</p>
            <p><strong>Shipping Address:</strong> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pinCode}</p>
            <p><strong>Phone:</strong> {shippingInfo.phoneNo}</p>

            <p className="flex items-center gap-2">
              <strong>Order Status :</strong>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                finalOrderStatus === "Delivered"
                  ? "bg-green-100 text-green-600"
                  : finalOrderStatus === "Shipped"
                  ? "bg-yellow-100 text-yellow-600"
                  : finalOrderStatus === "Cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}>
                {finalOrderStatus}
              </span>
            </p>

            <p><strong>Payment Status :</strong> {paymentStatus}</p>
            <p><strong>Total Price :</strong> ₹{totalPrice}</p>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white shadow-lg rounded-xl p-6 border">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Order Items</h2>

          <table className="w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.product} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 flex justify-center">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg shadow" />
                  </td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3 font-semibold">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update status */}
        <div className="bg-white shadow-lg rounded-xl p-6 border">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Update Status</h2>

          <div className="flex gap-4 items-center">
            <select
              className="border p-3 rounded-lg w-64 focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>

            <button
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition disabled:bg-gray-300"
              onClick={handleUpdate}
              disabled={loading || !status || orderStatus === "Delivered"}
            >
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UpdateOrder;
