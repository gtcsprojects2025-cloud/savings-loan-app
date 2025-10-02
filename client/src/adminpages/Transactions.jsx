import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Transactions = () => {
  console.log('Transactions component initializing render');

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

  console.log('Render state -> activeTab:', activeTab, ', formData:', formData, ', loading:', loading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`handleChange - field: ${name}, value:`, value);

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      console.log('handleChange -> new formData:', next);
      return next;
    });
  };

  const handleSearch = async () => {
    const name = searchTerm.trim().toLowerCase();
    console.log('handleSearch called. searchTerm:', searchTerm, 'normalized:', name);
    if (!name) {
      console.log('handleSearch - empty searchTerm, aborting');
      return;
    }

    try {
      console.log('handleSearch - fetching all users...');
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-all-users');
      console.log('handleSearch - raw response status:', res.status);
      const data = await res.json();
      console.log('handleSearch - parsed response data:', data);

      if (res.status === 200 && Array.isArray(data)) {
        const matches = data.filter((user) =>
          (user.firstName || '').toLowerCase().includes(name) ||
          (user.lastName || '').toLowerCase().includes(name) ||
          (user.otherNames || '').toLowerCase().includes(name)
        );
        console.log('handleSearch - filtered matches:', matches);
        setSearchResults(matches);
        toast.success('Search complete');
      } else {
        console.log('handleSearch - unexpected response format', { status: res.status, data });
        toast.error('Unexpected response format');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('handleSearch - error fetching users:', err);
      toast.error('Server error during search');
      setSearchResults([]);
    }
  };

  const handleSelectUser = async (user) => {
    console.log('handleSelectUser - selected user:', user);
    try {
      console.log('handleSelectUser - fetching account records...');
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-user-account-records');
      console.log('handleSelectUser - account records response status:', res.status);
      const data = await res.json();
      console.log('handleSelectUser - account records data:', data);

      if (res.status === 200 && Array.isArray(data)) {
        const match = data.find((u) => (u.email || '').toLowerCase() === (user.email || '').toLowerCase());
        console.log('handleSelectUser - found match:', match);
        if (match) {
          setFormData((prev) => {
            const next = {
              ...prev,
              email: match.email || '',
              BVN: match.BVN || '',
            };
            console.log('handleSelectUser -> new formData after loading account:', next);
            return next;
          });
          toast.success('User account loaded');
        } else {
          console.log('handleSelectUser - no matching account record for selected user');
          toast.error('No account record found for selected user');
        }
      } else {
        console.log('handleSelectUser - unexpected response format', { status: res.status, data });
        toast.error('Unexpected response format');
      }
    } catch (err) {
      console.error('handleSelectUser - error fetching account records:', err);
      toast.error('Error loading user account');
    }

    console.log('handleSelectUser - clearing search results and term');
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleSubmit = async (type) => {
    console.log('handleSubmit called for type:', type);
    setLoading(true);
    const normalizedType = (type || '').toLowerCase();
    console.log('handleSubmit - normalizedType:', normalizedType);

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
        // include loan extras ONLY for deposit with loanAmount
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

    console.log('handleSubmit - payload to send:', payload);

    try {
      console.log('handleSubmit - sending request to /api/transaction');
      const res = await fetch('https://savings-loan-app.vercel.app/api/transaction', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('handleSubmit - response status:', res.status);
      const data = await res.json();
      console.log('handleSubmit - response body:', data);

      if (res.status === 200) {
        console.log('handleSubmit - transaction successful:', data);
        toast.success(data.message || 'Transaction successful!');
      } else {
        console.warn('handleSubmit - transaction failed:', data);
        toast.error(data.message || data.error || 'Transaction failed.');
      }
    } catch (err) {
      console.error('handleSubmit - network/error while submitting transaction:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
      console.log('handleSubmit - finished, loading set to false');
    }
  };

  const renderForm = () => {
    console.log('renderForm - activeTab:', activeTab, ', formData.loanAmount:', formData.loanAmount);
    const isTransfer = activeTab === 'transfer';
    const isDeposit = activeTab === 'deposit';

    return (
      <div className="relative">
        {!isTransfer && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Search by Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  console.log('searchTerm input changed:', e.target.value);
                  setSearchTerm(e.target.value);
                }}
                placeholder="Enter name"
                className="flex-1 px-4 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  console.log('Search button clicked. current searchTerm:', searchTerm);
                  handleSearch();
                }}
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
                    onClick={() => {
                      console.log('search result clicked:', user);
                      handleSelectUser(user);
                    }}
                    className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-sm"
                  >
                    {user.firstName} {user.lastName} — {user.email}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Form submit prevented default. activeTab:', activeTab);
          }}
          className={`bg-white p-6 rounded-lg shadow-md ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <table className="table-auto w-full border-separate border-spacing-y-4">
            <tbody>
              {isTransfer ? (
                <>
                  {/* Transfer Fields */}
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
                  {/* Deposit & Withdraw Common Fields */}
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

                  {/* Extra loan fields ONLY for Deposit with loanAmount */}
                  {isDeposit && formData.loanAmount ? (
                    <>
                      <tr>
                        <td className="font-medium text-sm">Due Date</td>
                        <td>
                          <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-sm">Interest %</td>
                        <td>
                          <input
                            type="number"
                            name="interest"
                            value={formData.interest || ''}
                            onChange={handleChange}
                            placeholder="Enter interest %"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-sm">Guarantor</td>
                        <td>
                          <input
                            type="text"
                            name="guarantor"
                            value={formData.guarantor || ''}
                            onChange={handleChange}
                            placeholder="Enter guarantor name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-sm">Status</td>
                        <td>
                          <select
                            name="status"
                            value={formData.status || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
                  ) : null}
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
            onClick={() => {
              console.log('Primary button clicked -> will call handleSubmit with activeTab:', activeTab);
              handleSubmit(activeTab);
            }}
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
              console.log('Tab switched to:', tab);
              setActiveTab(tab);
              setFormData((prev) => {
                const next = { ...prev, transactionType: tab.toLowerCase() };
                console.log('Tab switch -> updated formData.transactionType:', next.transactionType);
                return next;
              });
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
