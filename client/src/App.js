import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../../client/src/Auth/login/LoginForm";
import ForgotPasswordPage from "../../client/src/Auth/login/ForgotPasswordPage";
import Register from "./Auth/register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./user/dashboard/Dashboard";



function App() {
  return (
    <Router>
      <Routes>
        {/* Admin page */}
        <Route path="/" element={<Dashboard />} />
        {/* Login Page */}
        <Route path="/Auth/login" element={<LoginForm />} />

          {/* Forgot Password Page */}
        <Route path="/forgotpasswordpage" element={<ForgotPasswordPage />} />

        {/* Register Page */}
        <Route path="/Auth/register" element={<Register />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;