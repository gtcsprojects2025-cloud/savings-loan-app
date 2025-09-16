import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CurrencyDollarIcon, GlobeAltIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import save from '../../assets/save.png'

const Saving = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    // Demo submit action
    console.log('Saving form data:', data);
    toast.success('Savings request submitted! (Demo)');
    reset();
  };

  return (
    <div className="p-4 w-full min-h-screen bg-white">
      {/* Introduction Section */}
      <div className=" rounded-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold text-brandBlue mb-4">Why Saving Matters</h2>
            <p className="text-gray-600 mb-4">
              Saving is the foundation of financial security. It helps you prepare for unexpected
              emergencies, achieve your dreams, and build a stable future. Whether it’s for a vacation,
              education, or a rainy day, every penny saved brings you closer to your goals.
            </p>
            <p className="text-gray-600">
              Start small, stay consistent, and watch your savings grow over time. Our platform makes
              it easy to set savings goals and track your progress.
            </p>
          </div>
          <div className="lg:w-1/2">
            <img
              src={save}
              alt="Saving Illustration"
              className="w-full h-72 object-contain rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">What You Can Save For</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
            <CurrencyDollarIcon className="h-8 w-8 text-brandOrange" />
            <div>
              <h4 className="text-md font-semibold text-gray-800">Emergency Fund</h4>
              <p className="text-sm text-gray-600">
                Be prepared for unexpected expenses like medical bills or car repairs.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
            <GlobeAltIcon className="h-8 w-8 text-brandBlue" />
            <div>
              <h4 className="text-md font-semibold text-gray-800">Dream Vacation</h4>
              <p className="text-sm text-gray-600">
                Save for that trip you’ve always wanted to take, from beaches to mountains.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
            <AcademicCapIcon className="h-8 w-8 text-brandOrange" />
            <div>
              <h4 className="text-md font-semibold text-gray-800">Education</h4>
              <p className="text-sm text-gray-600">
                Invest in your future or your children’s with savings for education.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Start Saving Now</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Savings Amount</label>
            <input
              type="number"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be greater than 0' },
              })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="Enter amount (e.g., 1000)"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Savings Purpose</label>
            <select
              {...register('purpose', { required: 'Purpose is required' })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.purpose ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
            >
              <option value="">Select a purpose</option>
              <option value="emergency">Emergency Fund</option>
              <option value="vacation">Vacation</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
            {errors.purpose && (
              <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Proceed to Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Saving;