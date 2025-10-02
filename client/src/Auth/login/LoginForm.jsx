import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import SHA256 from 'crypto-js/sha256';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const hashedPassword = SHA256(data.password).toString();

      const response = await fetch('https://savings-loan-app.vercel.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: hashedPassword,
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        toast.success(result.message || 'Login was successful!');
        localStorage.setItem('userToken', 'demo-token');
        localStorage.setItem('email', data.email);
        navigate('/');
      } else if (response.status === 403) {
        toast.error('User NOT found!');
      } else if (response.status === 405) {
        toast.error('Wrong login credentials!');
      } else if (response.status === 503) {
        toast.error('Server Error. Contact Admin');
      } else {
        toast.error(result.message || 'Login failed.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
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
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className={`mt-2 block w-full px-4 py-2 sm:py-3 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              className={`mt-2 block w-full px-4 py-2 sm:py-3 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandOrange pr-10`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-brandBlue hover:text-brandBlue/80"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-brandOrange text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-orange-600 transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600 space-y-2">
          <p>
            Don’t have an account?{' '}
            <Link to="/Auth/register/" className="text-brandBlue font-medium hover:underline">
              Register
            </Link>
          </p>
          <p>
            <Link to="/forgotpasswordpage" className="text-brandOrange font-medium hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
