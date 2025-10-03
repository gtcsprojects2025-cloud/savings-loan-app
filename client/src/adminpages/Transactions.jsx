import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [formData, setFormData] = useState({
    email: '',
    BVN: '',
    savingAmount: '',
    loanAmount: '',
    dueDate: '',
    interest: '',
    guarantor: '',
    status: '',
    comment: '',
    senderBVN: '',
    receiverBVN: '',
    amount: '',
    transactionType: 'deposit',
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserAccount, setSelectedUserAccount] = useState(null);

  // Fetch account whenever email or BVN changes
  useEffect(() => {
    const fetchAccount = async () => {
      if (!formData.email && !formData.BVN) {
        setSelectedUserAccount(null);
        return;
      }
      try {
        const res = await fetch('https://savings-loan-app.vercel.app/api/get-user-account-records');
        const data = await res.json();
        if (res.status === 200 && Array.isArray(data)) {
          const match = data.find(u =>
            (formData.email && u.email?.toLowerCase() === formData.email.toLowerCase()) ||
            (formData.BVN && u.BVN === formData.BVN)
          );
          if (match) {
            setSelectedUserAccount({
              totalSaving: Number(match.savingAmount || 0),
              totalLoan: Number(match.loanAmount || 0),
            });
          } else {
            setSelectedUserAccount({ totalSaving: 0, totalLoan: 0 });
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching account data');
        setSelectedUserAccount(null);
      }
    };

    // Debounce for live typing
    const timeout = setTimeout(fetchAccount, 500);
    return () => clearTimeout(timeout);
  }, [formData.email, formData.BVN]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-all-users');
      const data = await res.json();
      if (res.status === 200 && Array.isArray(data)) {
        const matches = data.filter(u =>
          (u.firstName || '').toLowerCase().includes(term) ||
          (u.lastName || '').toLowerCase().includes(term) ||
          (u.otherNames || '').toLowerCase().includes(term)
        );
        setSearchResults(matches);
      } else {
        setSearchResults([]);
        toast.error('Unexpected response format');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error during search');
    }
  };

  const handleSelectUser = (user) => {
    setFormData(prev => ({ ...prev, email: user.email || '', BVN: user.BVN || '' }));
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
        ...(normalizedType === 'deposit' && formData.loanAmount
          ? {
              dueDate: formData.dueDate,
              interest: formData.interest,
              guarantor: formData.guarantor,
              status: formData.status,
            }
          : {}),
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
        // Refresh totals after transaction
        if (formData.email || formData.BVN) {
          const res2 = await fetch('https://savings-loan-app.vercel.app/api/get-user-account-records');
          const data2 = await res2.json();
          if (res2.status === 200 && Array.isArray(data2)) {
            const match = data2.find(u =>
              (formData.email && u.email?.toLowerCase() === formData.email.toLowerCase()) ||
              (formData.BVN && u.BVN === formData.BVN)
            );
            if (match) {
              setSelectedUserAccount({
                totalSaving: Number(match.savingAmount || 0),
                totalLoan: Number(match.loanAmount || 0),
              });
            }
          }
        }
      } else {
        toast.error(data.message || data.error || 'Transaction failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    const isTransfer = activeTab === 'transfer';
    const isDeposit = activeTab === 'deposit';

    return (
      <div className="relative">
        {/* Search (not needed for transfer) */}
        {!isTransfer && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Search by Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
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

        {/* Display total balances */}
        {selectedUserAccount && (
          <div className="mb-4 p-4 bg-gray-100 rounded-md flex justify-between font-medium">
            <div>Total Saving: ₦{selectedUserAccount.totalSaving.toLocaleString()}</div>
            <div>Total Loan: ₦{selectedUserAccount.totalLoan.toLocaleString()}</div>
          </div>
        )}

        {/* Transaction Form */}
        <form
          onSubmit={e => e.preventDefault()}
          className={`bg-white p-6 rounded-lg shadow-md ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        >
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
                        value={formData.senderBVN}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
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
                        value={formData.receiverBVN}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
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
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
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
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
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
                        value={formData.BVN}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
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
                        value={formData.savingAmount}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-sm">Loan Amount</td>
                    <td>
                      <input
                        type="number"
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </td>
                  </tr>
                  {isDeposit && formData.loanAmount && (
                    <>
                      <tr>
                        <td className="font-medium text-sm">Due Date</td>
                        <td>
                          <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-sm">Interest %</td>
                        <td>
                          <input
                            type="number"
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-sm">Guarantor</td>
                        <td>
                          <input
                            type="text"
                            name="guarantor"
                            value={formData.guarantor}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-sm">Status</td>
                        <td>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md"
                          >
                            <option value="">Select status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="overdue">Overdue</option>
                          </select>
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td className="font-medium text-sm">Comment</td>
                    <td>
                      <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </td>
                  </tr>
                </>
              )}
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
        {['deposit', 'withdraw', 'transfer'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setFormData(prev => ({ ...prev, transactionType: tab.toLowerCase() }));
              setSearchResults([]);
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
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
