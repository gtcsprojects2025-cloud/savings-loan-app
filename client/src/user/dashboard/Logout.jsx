import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  

  const handleConfirm = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    navigate('/Auth/login');
  };

  const handleCancel = () => {
    setShowModal(false);
// reirect to home
navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-semibold text-brandBlue mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-brandOrange text-white rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;