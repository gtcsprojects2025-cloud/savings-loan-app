import React from 'react';

const WelcomeCard = ({ user }) => {
  return (
    <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6">
      <h2 className="text-3xl font-extrabold text-brandBlue">
        Welcome Back, {user.firstName || 'User'}!
      </h2>
      <p className="text-gray-600 mt-2">{user.lastName || ''}</p>
    </div>
  );
};

export default WelcomeCard;