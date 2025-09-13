import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../../client/src/Auth/login/LoginForm";
import ForgotPasswordPage from "../../client/src/Auth/login/ForgotPasswordPage";
import RegisterForm from "./Auth/register/registrationform"; // <-- create this file
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginForm />} />

          {/* Forgot Password Page */}
        <Route path="/forgotpasswordpage" element={<ForgotPasswordPage />} />

        {/* Register Page */}
        <Route path="/register/registrationform" element={<RegisterForm />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
