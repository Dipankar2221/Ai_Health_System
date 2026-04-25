import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";

import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts, fetchAllOrders, removeErrors } from "../features/admin/adminSlice";

import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Users,
  ClipboardList,
  MessageSquare,
  Menu,
  X,
  PackageCheck,
  DollarSign,
  Star,
  Boxes,
  AlertTriangle,
  ThumbsUp,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react";

const Dashboard = () => {

  const { dashboard, loading, error,products,orders,totalAmount } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders())
  }, [dispatch]);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const outOfStock = products.filter(product=>product.stock===0).length;
  const inStock = products.filter(product=>product.stock>0).length;
  const totalReviews=products.reduce((acc,product)=>acc+(product.reviews.length||0),0)


  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  const menuItems = [
    { title: "Dashboard", value: "dashboard", icon: <LayoutDashboard size={20} /> },
    { title: "All Products", value: "products", icon: <ShoppingBag size={20} /> },
    { title: "Create Product", value: "product/create", icon: <PlusCircle size={20} /> },
    { title: "All Users", value: "getUser", icon: <Users size={20} /> },
    { title: "All Orders", value: "orders", icon: <ClipboardList size={20} /> },
    { title: "All Reviews", value: "reviews", icon: <MessageSquare size={20} /> },
  ];

  return (
    <>
      <Navbar />
      <PageTitle title="Admin Dashboard" />

      <div className="flex bg-gray-100 py-15">
        {/* SIDEBAR */}
        <aside
          className={`bg-white shadow-md fixed md:sticky top-20 left-1 transition-all duration-300 overflow-hidden
            ${open ? "w-60" : "w-0 md:w-60"}`}
        >
          <div className="p-5 border-b">
            <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          </div>

          <nav className="mt-3">
            {menuItems.map((item) => (
              <Link
                key={item.value}
                to={item.value === "dashboard" ? "/admin/dashboard" : `/admin/${item.value}`}
                onClick={() => {
                  setActive(item.value);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-5 py-3 font-medium transition-colors
                ${
                  active === item.value
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden fixed top-24 left-4 bg-white shadow p-2 rounded-full z-50"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>

        {/* RIGHT CONTENT */}
        <main className="flex-1 p-6">
          {loading ? (
            <h1 className="text-center text-xl py-20">Loading...</h1>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard Overview</h2>

              {/* STAT CARDS */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card icon={<Boxes className="text-blue-600" size={40} />} title="Total Products" value={totalProducts} />
                <Card icon={<PackageCheck className="text-green-600" size={40} />} title="Total Orders" value={totalOrders} />
                <Card icon={<Star className="text-yellow-500" size={40} />} title="Total Reviews" value={totalReviews} />
                <Card icon={<DollarSign className="text-purple-600" size={40} />} title="Total Revenue" value={`₹${totalAmount}`} />
                <Card icon={<ThumbsUp className="text-green-500" size={40} />} title="In Stock" value={inStock} />
                <Card icon={<AlertTriangle className="text-red-600" size={40} />} title="Out of Stock" value={outOfStock} />
              </div>

              {/* SOCIAL MEDIA */}
              <h3 className="text-xl font-semibold mt-10 mb-4">Social Media</h3>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <SocialCard icon={<Facebook size={40} />} bg="bg-blue-600" title="Facebook Followers" value="12.5k" />
                <SocialCard icon={<Instagram size={40} />} bg="bg-pink-600" title="Instagram Followers" value="18.3k" />
                <SocialCard icon={<Youtube size={40} />} bg="bg-red-600" title="YouTube Subscribers" value="9.4k" />
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};

/* REUSABLE COMPONENTS */
const Card = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
    {icon}
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <span className="text-2xl font-semibold">{value}</span>
    </div>
  </div>
);

const SocialCard = ({ icon, title, value, bg }) => (
  <div className={`${bg} p-6 rounded-xl shadow text-white flex items-center gap-4`}>
    {icon}
    <div>
      <p className="text-sm opacity-80">{title}</p>
      <span className="text-2xl font-semibold">{value}</span>
    </div>
  </div>
);

export default Dashboard;
