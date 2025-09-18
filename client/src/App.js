import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../../client/src/Auth/login/LoginForm";
import ForgotPasswordPage from "../../client/src/Auth/login/ForgotPasswordPage";
import Register from "./Auth/register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import AdminDashboard from "./adminpages/AdminDashboard";
import Dashboard from "./user/dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/adminpages/admindashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/Auth/login" element={<LoginForm />} />
        <Route path="/forgotpasswordpage" element={<ForgotPasswordPage />} />
        <Route path="/Auth/register" element={<Register />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
