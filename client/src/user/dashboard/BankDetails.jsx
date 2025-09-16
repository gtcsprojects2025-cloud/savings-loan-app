import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const BankDetails = () => {
  const [isEditing, setIsEditing] = useState(!localStorage.getItem('bankDetails'));
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: JSON.parse(localStorage.getItem('bankDetails')) || {
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  });

  const user = JSON.parse(localStorage.getItem('user')) || {
    NIN: '12345678901',
    BVN: '98765432101',
  };

  const maskSensitive = (value) => {
    if (!value) return '***';
    return `${value.slice(0, 2)}******${value.slice(-1)}`;
  };

  const onSubmit = (data) => {
    console.log('Bank details data:', data);
    localStorage.setItem('bankDetails', JSON.stringify(data));
    toast.success('Bank details saved! (Demo)');
    setIsEditing(false);
    reset(data);
  };

  const bankDetails = JSON.parse(localStorage.getItem('bankDetails'));

  return (
    <div className="p-4 w-full min-h-screen bg-white">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Bank Details</h3>
          {bankDetails && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-brandOrange text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              {isEditing ? 'Cancel' : 'Edit Bank Details'}
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Bank Name</label>
                <input
                  type="text"
                  {...register('bankName', { required: 'Bank name is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.bankName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                  placeholder="e.g., First Bank"
                />
                {errors.bankName && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Account Number</label>
                <input
                  type="text"
                  {...register('accountNumber', {
                    required: 'Account number is required',
                    pattern: { value: /^\d{10}$/, message: 'Must be a 10-digit number' },
                  })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                  placeholder="e.g., 1234567890"
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.accountNumber.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Account Holder</label>
                <input
                  type="text"
                  {...register('accountHolder', { required: 'Account holder name is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.accountHolder ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                  placeholder="e.g., John Doe"
                />
                {errors.accountHolder && (
                  <p className="text-red-500 text-sm mt-1">{errors.accountHolder.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Card Number</label>
                <input
                  type="text"
                  {...register('cardNumber', {
                    required: 'Card number is required',
                    pattern: { value: /^\d{16}$/, message: 'Must be a 16-digit number' },
                  })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                  placeholder="e.g., 1234567890123456"
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  {...register('expiry', {
                    required: 'Expiry date is required',
                    pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Format: MM/YY' },
                  })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.expiry ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                  placeholder="e.g., 12/25"
                />
                {errors.expiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiry.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">CVV</label>
                <input
                  type="text"
                  {...register('cvv', {
                    required: 'CVV is required',
                    pattern: { value: /^\d{3}$/, message: 'Must be a 3-digit number' },
                  })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                  placeholder="e.g., 123"
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition mt-4"
            >
              Save Bank Details
            </button>
          </form>
        ) : (
          <div>
            {bankDetails ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className='flex flex-col gap-9' >
                  <p><strong>Bank Name:</strong> <br/> {bankDetails.bankName}</p>
                  <p><strong>Account Number:</strong><br/> {maskSensitive(bankDetails.accountNumber)}</p>
                  <p><strong>Account Holder:</strong><br/> {bankDetails.accountHolder}</p>
                </div>
            <div className='flex flex-col gap-9' >
                  <p><strong>Card Number:</strong><br/> {maskSensitive(bankDetails.cardNumber)}</p>
                  <p><strong>Expiry Date:</strong><br/> {bankDetails.expiry}</p>
                  <p><strong>CVV:</strong><br/> {maskSensitive(bankDetails.cvv)}</p>
                </div>
            <div className='flex flex-col gap-9' >
                  <p><strong>NIN:</strong><br/> {maskSensitive(user.NIN)}</p>
                  <p><strong>BVN:</strong><br/> {maskSensitive(user.BVN)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No card added yet. Please add your bank details.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BankDetails;