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
    transactionType: 'deposit',
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = async () => {
    const name = searchTerm.trim().toLowerCase();
    if (!name) return;

    console.log('Searching for user by name:', name);

    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-all-users');
      const data = await res.json();

      console.log('Fetched all users:', data);

      if (res.status === 200 && Array.isArray(data)) {
        const matches = data.filter((user) =>
          user.firstName?.toLowerCase().includes(name) ||
          user.lastName?.toLowerCase().includes(name) ||
          user.otherNames?.toLowerCase().includes(name)
        );
        console.log('Filtered matches:', matches);
        setSearchResults(matches);
        toast.success('Search complete');
      } else {
        toast.error('Unexpected response format');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Server error during search');
    }
  };

  const handleSelectUser = async (user) => {
    console.log('Selected user:', user);

    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-user-account-records');
      const data = await res.json();

      console.log('Fetched account records:', data);

      if (res.status === 200 && Array.isArray(data)) {
        const match = data.find((u) => u.email?.toLowerCase() === user.email?.toLowerCase());
        if (match) {
          setFormData((prev) => ({
            ...prev,
            email: match.email || '',
            BVN: match.BVN || '',
          }));
          toast.success('User account loaded');
        } else {
          toast.error('No account record found for selected user');
        }
      } else {
        toast.error('Unexpected response format');
      }
    } catch (err) {
      console.error('Account fetch error:', err);
      toast.error('Error loading user account');
    }

    setSearchResults([]);
    setSearchTerm('');
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

    console.log('Submitting transaction:', payload);

    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/transaction', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Transaction response:', data);

      if (res.status === 200) {
        toast.success(data.message || 'Transaction successful!');
      } else {
        toast.error(data.message || data.error || 'Transaction failed.');
      }
    } catch (err) {
      console.error('Transaction error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    const isTransfer = activeTab === 'transfer';

    return (
      <div className="relative">
        {!isTransfer && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Search by Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter name"
                className="flex-1 px-4 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Search
              </button>
            </div>
            {searchResults.length > 0 && (
              <ul className="mt-2 border rounded-md bg-white shadow-sm max-h-40 overflow-y-auto">
                {searchResults.map((user, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectUser(user)}
                    className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-sm"
                  >
                    {user.firstName} {user.lastName} — {user.email}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className={`bg-white p-6 rounded-lg shadow-md ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <table className="table-auto w-full border-separate border-spacing-y-4">
            <tbody>
              {isTransfer ? (
                <>
                  <tr>
                    <td className="w-1/4 font-medium text-sm">Sender BVN</td>
                    <td>
                      <input
                        type="text"
                        name="senderBVN"
                        value={formData.senderBVN || ''}
                        onChange={handleChange}
                        placeholder="Enter sender BVN"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
                        value={formData.receiverBVN || ''}
                        onChange={handleChange}
                        placeholder="Enter receiver BVN"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
                        value={formData.amount || ''}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td className="w-1/4 font-medium text-sm">Email</td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
                        value={formData.BVN || ''}
                        onChange={handleChange}
                        placeholder="Enter BVN"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
                        value={formData.savingAmount || ''}
                        onChange={handleChange}
                        placeholder="Enter saving amount"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-sm">Loan Amount</td>
                    <td>
                      <input
                        type="number"
                        name="loanAmount"
                        value={formData.loanAmount || ''}
                        onChange={handleChange}
                                               placeholder="Enter loan amount"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <td className="font-medium text-sm">Comment</td>
                <td>
                  <textarea
                    name="comment"
                    value={formData.comment || ''}
                    onChange={handleChange}
                    placeholder="Optional comment"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      <div className="flex gap-4 mb-6">
        {['deposit', 'withdraw', 'transfer'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              console.log('Switched to tab:', tab);
              setActiveTab(tab);
              setFormData((prev) => ({ ...prev, transactionType: tab.toLowerCase() }));
              setSearchResults([]);
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {renderForm()}
    </div>
  );
};

export default Transactions;
