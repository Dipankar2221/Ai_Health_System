// pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FavoriteIcon from "@mui/icons-material/Favorite";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Product from "../components/Product";
import Loader from "../components/Loader";

import { getProduct, removeErrors } from "../features/products/productSlice";
import NoProducts from "../components/NoProducts";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products = [] } = useSelector((state) => state.product);

  const [randomProducts, setRandomProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    dispatch(getProduct({ page: 1 }));
  }, [dispatch]);

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Something went wrong");
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // Shuffle products
  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 8));
    }
  }, [products]);

  return (
    <>
      <PageTitle title="FirstShop" />
      <Navbar />

      <div className="min-h-screen">

        {/* 🔥 HERO */}
        <div
          className="relative h-[90vh] flex items-center justify-center text-center text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 px-4">
            <h1 className="text-3xl md:text-5xl font-bold flex justify-center items-center gap-2">
              <FavoriteIcon fontSize="large" />
              AI Health Diagnosis System
            </h1>

            <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto">
              Predict diseases early with AI-powered insights and get smart health recommendations instantly.
            </p>

            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              <Link
                to="/signup"
                className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
              >
                Login
              </Link>

              {/* ✅ NEW STORE BUTTON */}
              <Link
                to="/products"
                className="bg-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
              >
                Visit Store
              </Link>
            </div>
          </div>
        </div>

        {/* ✅ FEATURES */}
        <div className="bg-gray-100 py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Why Choose Our AI System?
          </h2>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
              <h3 className="font-bold text-lg">Multi-Disease Prediction</h3>
              <p className="text-sm mt-2 text-gray-600">
                Predict multiple diseases using advanced AI models.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
              <h3 className="font-bold text-lg">AI Recommendations</h3>
              <p className="text-sm mt-2 text-gray-600">
                Get personalized diet and lifestyle advice instantly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
              <h3 className="font-bold text-lg">Real-Time Reports</h3>
              <p className="text-sm mt-2 text-gray-600">
                Download and track your health reports anytime.
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 FEATURED PRODUCTS */}
        <div className="py-12 px-4 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              🛒 Featured Health Products
            </h2>

            <Link
              to="/products"
              className="text-blue-600 font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading products..." />
          ) : randomProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {randomProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <NoProducts />
          )}
        </div>

        {/* CTA */}
        <div className="bg-blue-600 text-white text-center py-10 px-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            Start Your Health Journey Today
          </h2>

          <p className="mt-3">
            Join now and take control of your health using AI.
          </p>

          <Link
            to="/signup"
            className="mt-5 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
          >
            Create Account
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;