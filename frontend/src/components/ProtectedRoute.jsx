import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);

  // ⛔ wait until user loads (VERY IMPORTANT)
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // 🔐 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Admin only check
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;