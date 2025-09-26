import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [emailSearch, setEmailSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const TRANSACTIONS_PER_PAGE = 15;
  const hasFetched = useRef(false); // Prevent double fetch

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAllTransactions();
    }
  }, []);

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-all-members-transactions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      const transactions = Array.isArray(data) ? data : data.transaction_details || [];

      if (Array.isArray(transactions)) {
        setTransactions(transactions);
        setFilteredTransactions(transactions);
        toast.success('Transactions loaded successfully.');
      } else {
        toast.error('Unexpected data format from server.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const term = emailSearch.trim().toLowerCase();
    if (!term) {
      setFilteredTransactions(transactions);
      setCurrentPage(1);
      return;
    }

    const filtered = transactions.filter((tx) =>
      tx.email?.toLowerCase().includes(term)
    );

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * TRANSACTIONS_PER_PAGE,
    currentPage * TRANSACTIONS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Transaction History</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="email"
          placeholder="Search by email"
          value={emailSearch}
          onChange={(e) => setEmailSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
        >
          Filter
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-orange-600 font-medium text-lg">
          Loading transactions…
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">BVN</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Savings</th>
                <th className="px-4 py-2 border">Loans</th>
                <th className="px-4 py-2 border">Comment</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr key={tx._id || `${tx.email}-${tx.dateCreated}`} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{tx.email || 'N/A'}</td>
                    <td className="px-4 py-2 border">{tx.BVN || 'N/A'}</td>
                    <td className="px-4 py-2 border">{tx.transactionType || tx.type || 'N/A'}</td>
                    <td className="px-4 py-2 border">₦{(tx.savingAmount ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-2 border">₦{(tx.loanAmount ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-2 border">{tx.comment || '—'}</td>
                    <td className="px-4 py-2 border">
                      {tx.dateCreated ? new Date(tx.dateCreated).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md text-white ${
            currentPage === 1 ? 'bg-orange-200 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
          } transition`}
        >
          Prev
        </button>

        <span className="text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-white ${
            currentPage === totalPages ? 'bg-orange-200 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
          } transition`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory;
