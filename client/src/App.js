import React from 'react';
import LoginForm from '../../client/src/Auth/login/LoginForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <LoginForm />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
