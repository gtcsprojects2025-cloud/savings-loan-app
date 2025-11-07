import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
        console.warn(`Retry ${i + 1} for ${url}`);
      } else {
        throw err;
      }
    }
  }
};

const TransactionHistory = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalItem, setModalItem] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const email = localStorage.getItem('email') || 'rolandmario2@gmail.com';
  const userToken = localStorage.getItem('userToken') || 'demo-token';

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWithRetry(
          `https://admin.gtcooperative.com/api/get-transaction-history?email=${email}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${userToken}`, // Uncomment if required
            },
          }
        );
        const result = await response.json();
        console.log('Transaction API response:', JSON.stringify(result, null, 2));
        if (response.ok && result.transaction_details) {
          const transformedTransactions = result.transaction_details.map((tx, index) => ({
            id: tx._id || `tx-${index + 1}`,
            date: format(new Date(tx.dateCreated), 'yyyy-MM-dd'),
            type: tx.transactionType?.toLowerCase() || 'unknown',
            amount: tx.savingAmount || tx.loanAmount || 0,
            party: tx.comment || 'N/A',
            status: tx.status || 'Completed',
            notes: tx.comment || 'No notes',
          }));
          setTransactions(transformedTransactions);
        } else {
          console.warn('No transaction data found:', result.message);
          setTransactions([]); // Set empty array for no transactions
        }
      } catch (err) {
        console.error('Transaction fetch error:', err.message);
        setError(`Failed to load transactions: ${err.message}`);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [email]);

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(
    (item) =>
      item.party.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="p-4 w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full min-h-screen bg-white">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Transaction History</h3>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by party, type, or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue pl-10"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Party</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 relative"
                  onMouseEnter={() => setModalItem(item)}
                  onMouseLeave={() => setModalItem(null)}
                >
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">{item.date}</td>
                  <td className="p-3 capitalize">{item.type.replace('_', ' ')}</td>
                  <td className="p-3">₦{item.amount.toLocaleString()}</td>
                  <td className="p-3">{item.party}</td>
                  <td
                    className={`p-3 ${
                      item.status === 'Completed'
                        ? 'text-green-600'
                        : item.status === 'Pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {item.status}
                  </td>
                  <td className="p-3">{item.method}</td>
                  {modalItem && modalItem.id === item.id && (
                    <div className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-80 left-1/2 transform -translate-x-1/2 mt-12">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Transaction Details</h4>
                      <p><strong>ID:</strong> {item.id}</p>
                      <p><strong>Date:</strong> {item.date}</p>
                      <p><strong>Type:</strong> {item.type.replace('_', ' ')}</p>
                      <p><strong>Amount:</strong> ${item.amount.toLocaleString()}</p>
                      <p><strong>Party:</strong> {item.party}</p>
                      <p><strong>Status:</strong> {item.status}</p>
                      <p><strong>Method:</strong> {item.method}</p>
                      <p><strong>Notes:</strong> {item.notes}</p>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brandBlue text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#f97316] text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;