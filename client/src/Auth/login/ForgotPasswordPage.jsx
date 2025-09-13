import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpConfirmed, setOtpConfirmed] = useState(false);
  const navigate = useNavigate();

  // STEP 1: Submit Email
  const handleEmailSubmit = async (data) => {
    setLoading(true);
    setEmail(data.email);

    await new Promise((r) => setTimeout(r, 1500)); // Simulated delay

    //email check
    if (data.email === 'juliusedicha@gmail.com') {
      toast.success(`OTP sent to ${data.email}`);
      setOtpSent(true);
      setStep(2);
    } else {
      toast.error('Email does not exist or is not valid');
    }

    setLoading(false);
  };

  // STEP 2: Submit OTP
  const handleOtpSubmit = async (data) => {
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500)); // Simulated delay

    if (data.otp === '123456') {
      toast.success('OTP confirmed!');
      setOtpConfirmed(true);
      setStep(3);
    } else {
      toast.error('Invalid OTP');
    }

    setLoading(false);
  };

  // STEP 3: Submit New Password
  const handlePasswordReset = async (data) => {
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500)); // Simulated delay

    toast.success('Password reset successful!');

    
    setTimeout(() => {
      navigate('/');
    }, 2000);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-xl p-8 sm:p-10">
         <div className="flex justify-center mb-4">
  <img src="/logo.jpg" alt="Company Logo" className="h-12 sm:h-14" />
</div>

        <h2 className="text-2xl font-bold text-center text-brandBlue mb-6">Forgot Password</h2>

        {step === 1 && (
          <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className={`mt-2 block w-full px-4 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && otpSent && (
          <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                {...register('otp', { required: 'OTP is required' })}
                className={`mt-2 block w-full px-4 py-2 border ${
                  errors.otp ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandOrange`}
                placeholder="123456"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && otpConfirmed && (
          <form onSubmit={handleSubmit(handlePasswordReset)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                className={`mt-2 block w-full px-4 py-2 border ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                placeholder="••••••••"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === watch('newPassword') || 'Passwords do not match',
                })}
                className={`mt-2 block w-full px-4 py-2 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandOrange`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
