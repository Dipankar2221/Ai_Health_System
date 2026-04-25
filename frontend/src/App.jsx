import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";

// Auth
import Register from "./user/Register";
import Login from "./user/Login";
import Profile from "./user/Profile";
import UpdateProfile from "./user/UpdateProfile";
import UpdatePassword from "./user/UpdatePassword";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

// Cart & Orders
import Cart from "./Cart/Cart";
import Shipping from "./Cart/Shipping";
import OrderConfirm from "./Cart/OrderConfirm";
import Payment from "./Cart/Payment";
import PaymentSuccess from "./Cart/PaymentSuccess";
import MyOrders from "./order/MyOrders";
import OrderDetails from "./order/OrderDetails";

// Admin
import Dashboard from "./Admin/Dashboard";
import ProductList from "./Admin/ProductList";
import CreateProduct from "./Admin/CreateProduct";
import UpdateProduct from "./Admin/UpdateProduct";
import UserList from "./Admin/UserList";
import UpdateRole from "./Admin/UpdateRole";
import OrdersList from "./Admin/OrdersList";
import UpdateOrder from "./Admin/UpdateOrder";
import ReviewsList from "./Admin/ReviewsList";

// Health AI
import DashboardPage from "./pages/Dashboar"; // ✅ rename file properly
import Heart from "./pages/Predict/Heart";
import Stroke from "./pages/Predict/Stroke";
import Diabetes from "./pages/Predict/Diabetes";
import Kidney from "./pages/Predict/Kidney";
import Liver from "./pages/Predict/Liver";
import Reports from "./pages/Reports";
import Chatbot from "./pages/Chatbot";

// Redux
import { loadUser } from "./features/user/userSlice";
import { loadCartForUser } from "./features/cart/cartSlice";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      dispatch(loadCartForUser(user._id));
    }
  }, [user, dispatch]);

  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />

        {/* USER */}
        <Route path="/me" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
        <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
        <Route path="/order/confirm" element={<ProtectedRoute><OrderConfirm /></ProtectedRoute>} />
        <Route path="/process/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/order/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/orders/user" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute adminOnly><ProductList /></ProtectedRoute>} />
        <Route path="/admin/product/create" element={<ProtectedRoute adminOnly><CreateProduct /></ProtectedRoute>} />
        <Route path="/admin/product/update/:id" element={<ProtectedRoute adminOnly><UpdateProduct /></ProtectedRoute>} />
        <Route path="/admin/getUser" element={<ProtectedRoute adminOnly><UserList /></ProtectedRoute>} />
        <Route path="/admin/getUser/:id" element={<ProtectedRoute adminOnly><UpdateRole /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute adminOnly><OrdersList /></ProtectedRoute>} />
        <Route path="/admin/order/:id" element={<ProtectedRoute adminOnly><UpdateOrder /></ProtectedRoute>} />
        <Route path="/admin/reviews" element={<ProtectedRoute adminOnly><ReviewsList /></ProtectedRoute>} />

        {/* HEALTH AI */}
        <Route path="/dash" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />

        <Route path="/predict/heart" element={<ProtectedRoute><Heart /></ProtectedRoute>} />
        <Route path="/predict/stroke" element={<ProtectedRoute><Stroke /></ProtectedRoute>} />
        <Route path="/predict/diabetes" element={<ProtectedRoute><Diabetes /></ProtectedRoute>} />
        <Route path="/predict/kidney" element={<ProtectedRoute><Kidney /></ProtectedRoute>} />
        <Route path="/predict/liver" element={<ProtectedRoute><Liver /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
};

export default App;