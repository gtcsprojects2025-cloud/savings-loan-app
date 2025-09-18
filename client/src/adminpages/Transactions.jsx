import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [formData, setFormData] = useState({
    email: '',
    BVN: '',
    savingAmount: '',
    loanAmount: '',
    comment: '',
    senderBVN: '',
    receiverBVN: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (type) => {
    setLoading(true);
    const normalizedType = type.toLowerCase();

    let payload = {};
    if (normalizedType === 'transfer') {
      payload = {
        senderBVN: formData.senderBVN,
        receiverBVN: formData.receiverBVN,
        amount: formData.amount,
        transactionType: normalizedType,
        comment: formData.comment,
      };
    } else {
      payload = {
        email: formData.email,
        BVN: formData.BVN,
        savingAmount: formData.savingAmount,
        loanAmount: formData.loanAmount,
        transactionType: normalizedType,
        comment: formData.comment,
      };
    }

    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/transaction', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message || 'Transaction successful!');
      } else {
        toast.error(data.message || data.error || 'Transaction failed.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (activeTab === 'transfer') {
      return (
        <form onSubmit={(e) => e.preventDefault()} className="bg-white p-6 rounded-lg shadow-md">
          <table className="table-auto w-full border-separate border-spacing-y-4">
            <tbody>
              <tr>
                <td className="w-1/4 font-medium text-sm">Sender BVN</td>
                <td>
                  <input
                    type="text"
                    name="senderBVN"
                    placeholder="Enter sender BVN"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="font-medium text-sm">Receiver BVN</td>
                <td>
                  <input
                    type="text"
                    name="receiverBVN"
                    placeholder="Enter receiver BVN"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="font-medium text-sm">Amount</td>
                <td>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
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
            type="button"
            onClick={() => handleSubmit('transfer')}
            className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition w-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Transfer'}
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={(e) => e.preventDefault()} className="bg-white p-6 rounded-lg shadow-md">
        <table className="table-auto w-full border-separate border-spacing-y-4">
          <tbody>
            <tr>
              <td className="w-1/4 font-medium text-sm">Email</td>
              <td>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
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
          type="button"
          onClick={() => handleSubmit(activeTab)}
          className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition w-full"
          disabled={loading}
        >
          {loading ? 'Processing...' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>
      </form>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      {/* Tabs on Top */}
      <div className="flex gap-4 mb-6">
        {['deposit', 'withdrawal', 'transfer'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setFormData((prev) => ({ ...prev, transactionType: tab }));
            }}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Form */}
      {renderForm()}
    </div>
  );
};

export default Transactions;
