import React, { useState, useRef, useEffect } from "react";
import {
  Close,
  Menu,
  PersonAdd,
  Search,
  ShoppingBag,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout, removeSuccess } from "../features/user/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems = [] } = useSelector((state) => state.cart);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPredictOpen, setIsPredictOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const dropdownRef = useRef(null);
  const predictRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (predictRef.current && !predictRef.current.contains(e.target)) {
        setIsPredictOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(
      keyword.trim()
        ? `/products/?keyword=${encodeURIComponent(keyword)}`
        : "/products"
    );
    setKeyword("");
    setIsMenuOpen(false);
  };

  const logoutUser = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logout Successful");
      dispatch(removeSuccess());
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Logout Failed");
    }
  };

  const go = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsPredictOpen(false);
  };

  const options = [
    ...(user?.role === "admin"
    ? [{ name: "Admin Dashboard", action: () => go("/admin/dashboard") }]
    : []),
    { name: "Orders", action: () => go("/orders/user") },
    { name: "Account", action: () => go("/me") },
    { name: `Cart (${cartItems.length})`, action: () => go("/cart") },
    { name: "Logout", action: logoutUser },
  ];

  return (
    <nav className="fixed text-white top-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          <span className="text-blue-500">Health</span>
          <span className="text-white">AI</span>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-6">

          <Link className="hover:text-blue-400 transition" to="/">Home</Link>
          <Link className="hover:text-blue-400 transition" to="/products">Medicine</Link>
          <Link className="hover:text-blue-400 transition" to="/dash">Dashboard</Link>
          <Link className="hover:text-blue-400 transition" to="/reports">Reports</Link>
          <Link className="hover:text-blue-400 transition" to="/chatbot">Chatbot</Link>

          {/* Predict Dropdown */}
          <div ref={predictRef} className="relative">
            <button
              onClick={() => setIsPredictOpen(!isPredictOpen)}
              className="hover:text-blue-400 transition"
            >
              Predict ▾
            </button>

            {isPredictOpen && (
              <div className="absolute top-10 left-0 w-44 bg-white text-black rounded-xl shadow-lg overflow-hidden">
                {[
                  { name: "Heart", path: "/predict/heart" },
                  { name: "Stroke", path: "/predict/stroke" },
                  { name: "Diabetes", path: "/predict/diabetes" },
                  { name: "Kidney", path: "/predict/kidney" },
                  { name: "Liver", path: "/predict/liver" },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => go(item.path)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SEARCH */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-500 rounded-full px-3 py-1 focus-within:ring-2 ring-blue-500"
          >
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search..."
              className="bg-transparent outline-none text-sm px-2 w-32"
            />
            <button type="submit">
              <Search fontSize="small" />
            </button>
          </form>

          {/* CART */}
          <Link to="/cart" className="relative hover:text-blue-400 transition">
            <ShoppingBag />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* AUTH */}
          {!isAuthenticated ? (
            <Link to="/login" className="hover:text-blue-400 transition">
              <PersonAdd />
            </Link>
          ) : (
            <div ref={dropdownRef} className="relative">
              <img
                src={user?.avatar?.url || "/images/profile.png"}
                alt="User"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 rounded-full cursor-pointer border-2 border-gray-600 hover:border-blue-500 transition"
              />

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-xl shadow-lg overflow-hidden">
                  {options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={opt.action}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
        >
          {isMenuOpen ? <Close /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 px-5 py-4 space-y-4 border-t border-gray-800">

          <Link onClick={() => go("/")} className="block">Home</Link>
          <Link onClick={() => go("/products")} className="block">Products</Link>
          <Link onClick={() => go("/dash")} className="block">Dashboard</Link>
          <Link onClick={() => go("/reports")} className="block">Reports</Link>
          <Link onClick={() => go("/chatbot")} className="block">Chatbot</Link>

          <div>
            <p className="font-semibold mb-2">Predict</p>
            {[
              "/predict/heart",
              "/predict/stroke",
              "/predict/diabetes",
              "/predict/kidney",
              "/predict/liver",
            ].map((path, i) => (
              <button
                key={i}
                onClick={() => go(path)}
                className="block text-left w-full py-1 capitalize"
              >
                {path.split("/")[2]}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;