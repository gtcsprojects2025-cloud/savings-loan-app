import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../../client/src/Auth/login/LoginForm";
import ForgotPasswordPage from "../../client/src/Auth/login/ForgotPasswordPage";
import Register from "./Auth/register";
import AdminLoginForm from "./Auth/login/AdminLoginForm"; // ✅ NEW
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminDashboard from "./adminpages/AdminDashboard";
import Dashboard from "./user/dashboard/Dashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Dashboard (Protected) */}
        <Route
          path="/adminpages/admindashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* User Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* User Auth */}
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/forgotpasswordpage" element={<ForgotPasswordPage />} />

        {/* Admin Auth */}
        <Route path="/admin-login" element={<AdminLoginForm />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
