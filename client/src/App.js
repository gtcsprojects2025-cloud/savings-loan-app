import React from 'react';
import LoginForm from '../../client/src/Auth/login/LoginForm';
import RegisterForm from '../../client/src/Auth/register/RegisterForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <LoginForm />
      <RegisterForm />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
