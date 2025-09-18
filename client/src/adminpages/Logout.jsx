import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    navigate('/Auth/login');
  }, [navigate]);

  return (
    <div>
      <h1 className="text-xl font-bold">Logging out...</h1>
    </div>
  );
};

export default Logout;
