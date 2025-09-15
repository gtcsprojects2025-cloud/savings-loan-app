import React from 'react';

const WelcomeCard = ({ user }) => {
  return (
    <div className=" rounded-xl p-6 mb-6">
      <h2 className="text-3xl font-extrabold text-brandBlue">
        Welcome Back, {user.firstName}!
      </h2>
      <p className="text-gray-600 mt-2">{user.lastName}</p>
    </div>
  );
};

export default WelcomeCard;