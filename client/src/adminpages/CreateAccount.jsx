import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    email: '',
    BVN: '',
    savingAmount: '',
    loanAmount: '',
    transactionType: 'Create',
    comment: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/create-user-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message || 'Account created successfully!');
      } else if (res.status === 400) {
        toast.error(data.message || 'User account already exists.');
      } else if (res.status === 500) {
        toast.error(data.message || 'Server error. Please try again.');
      } else {
        toast.error('Unexpected response.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Account</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <table className="table-auto w-full border-separate border-spacing-y-4">
          <tbody>
            <tr>
              <td className="w-1/4 font-medium text-sm">Email</td>
              <td>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter user's email"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="font-medium text-sm">BVN</td>
              <td>
                <input
                  type="text"
                  name="BVN"
                  placeholder="Enter BVN"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="font-medium text-sm">Saving Amount</td>
              <td>
                <input
                  type="number"
                  name="savingAmount"
                  placeholder="Enter saving amount"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </td>
            </tr>
            <tr>
              <td className="font-medium text-sm">Loan Amount</td>
              <td>
                <input
                  type="number"
                  name="loanAmount"
                  placeholder="Enter loan amount"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </td>
            </tr>
            <tr>
              <td className="font-medium text-sm">Comment</td>
              <td>
                <textarea
                  name="comment"
                  placeholder="Optional comment"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition w-full"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
