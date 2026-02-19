import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import SHA256 from 'crypto-js/sha256';
import { toast } from 'react-toastify';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // const hashedPassword = SHA256(password).toString();
      const payload = { email, password: password };

      console.log('Sending payload:', payload);

      const response = await fetch('https://admin.gtcooperative.com/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      toast.success('Login successful!');
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('isAdminAuthenticated', 'true');

      // Updated navigation: go to admin dashboard
      navigate('/adminpages/admindashboard', { replace: true });

    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-5 lg:px-0 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white border border-gray-200 shadow-2xl rounded-xl p-8 sm:p-10">
        <div className="flex justify-center mb-4">
          <img src="/logo.jpg" alt="Company Logo" className="h-12 sm:h-14" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-brandBlue mb-6 tracking-tight">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-2 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandOrange pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-brandBlue hover:text-brandBlue/80"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/forgetPasswordPage" className="text-indigo-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-brandOrange text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-orange-600 transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
