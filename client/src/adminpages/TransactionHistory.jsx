import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [emailSearch, setEmailSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const TRANSACTIONS_PER_PAGE = 15;

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-transaction-history', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '' }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setTransactions(data.transaction_details || []);
        setFilteredTransactions(data.transaction_details || []);
        toast.success('All transactions loaded.');
      } else {
        toast.error(data.error || 'Failed to load transactions.');
      }
    } catch (err) {
      toast.error('Server error. Please try again.');
    }
  };

  const handleSearch = () => {
    const term = emailSearch.trim().toLowerCase();
    if (!term) {
      setFilteredTransactions(transactions);
      setCurrentPage(1);
      return;
    }

    const filtered = transactions.filter(
      (tx) => tx.email.toLowerCase().includes(term)
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
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <input
          type="email"
          placeholder="Search by email"
          value={emailSearch}
          onChange={(e) => setEmailSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">BVN</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Savings</th>
              <th className="px-4 py-2 border">Loan</th>
              <th className="px-4 py-2 border">Comment</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{tx.email}</td>
                <td className="px-4 py-2 border">{tx.BVN}</td>
                <td className="px-4 py-2 border">{tx.transactionType}</td>
                <td className="px-4 py-2 border">{tx.savingAmount}</td>
                <td className="px-4 py-2 border">{tx.loanAmount}</td>
                <td className="px-4 py-2 border">{tx.comment}</td>
                <td className="px-4 py-2 border">
                  {new Date(tx.dateCreated).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory;
