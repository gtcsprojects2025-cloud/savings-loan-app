import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(true); // show modal by default

  const handleLogout = () => {
    localStorage.clear();
    navigate('/Auth/login');
  };

  const handleCancel = () => {
    setShowConfirm(false);
    navigate('/adminpages/admindashboard'); // or redirect to your default page
  };

  if (!showConfirm) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
        <p className="mb-6 text-gray-700">Are you sure you want to log out?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            Yes
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
