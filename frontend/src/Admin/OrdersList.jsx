import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, deleteOrder, fetchAllOrders, removeErrors, removeSuccess } from "../features/admin/adminSlice";
import { Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
/**
 * Helper: returns Tailwind classes for order status badge
 */
const statusBadge = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("delivered")) return "bg-green-100 text-green-800";
  if (s.includes("shipped")) return "bg-blue-100 text-blue-800";
  if (s.includes("processing")) return "bg-yellow-100 text-yellow-800";
  if (s.includes("cancel") || s.includes("returned")) return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const OrdersList = () => {
  const { orders, loading, error,success,message } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

const handleDelete = (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this order?");
  if (confirmDelete) {
    dispatch(deleteOrder(id));
  }
};

useEffect(() => {
  if (error) {
    toast.error(error, { position: "top-center", autoClose: 2500 });
    dispatch(removeErrors());
  }

  if (success) {
    toast.success(message, { position: "top-center", autoClose: 2500 });
    dispatch(removeSuccess());
    dispatch(clearMessage());
    dispatch(fetchAllOrders());
  }
}, [error, success, message, dispatch]);


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="All Orders" />

          <div className="min-h-[60vh] bg-gray-50 py-8 px-4 md:px-10">
            <div className="max-w-7xl mx-auto py-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  All Orders
                </h1>

                <div className="text-sm text-gray-600">
                  {orders?.length ?? 0} orders
                </div>
              </div>

              <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-400">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Sl No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Total Price
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider">
                        # Items
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-100">
                    {orders && orders.length > 0 ? (
                      orders.map((order, idx) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {idx + 1}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="max-w-xs truncate">
                              <Link
                                to={`/admin/order/${order._id}`}
                                className="text-indigo-600 hover:underline"
                              >
                                {order._id}
                              </Link>
                            </div>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                            ₹{order.totalPrice?.toFixed?.(2) ?? order.totalPrice}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            {order.orderItems?.length ?? 0}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                            <div className="inline-flex items-center gap-2">
                              <Link
                                to={`/admin/order/${order._id}`}
                                className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-transparent hover:border-indigo-200 focus:outline-none"
                                title="View / Edit"
                              >
                                <Edit className="w-5 h-5 text-indigo-600" />
                              </Link>

                              <button
                                type="button"
                                className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-transparent hover:bg-red-50 focus:outline-none"
                                title="Delete Order"
                                 onClick={() => handleDelete(order._id)}
                              >
                                <Delete className="w-5 h-5 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* pagination / footer row (optional) */}
              <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                <div>Showing {orders?.length ?? 0} orders</div>
                <div className="hidden md:block">—</div>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default OrdersList;
