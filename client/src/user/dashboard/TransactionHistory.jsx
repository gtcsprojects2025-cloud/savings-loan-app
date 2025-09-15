import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const TransactionHistory = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalItem, setModalItem] = useState(null);
  const itemsPerPage = 10;

  // Demo transaction data (20 records, varied types)
  const transactions = [
    { id: 1, date: '2025-09-01', type: 'withdraw', amount: 500, party: 'John Doe', status: 'Completed', method: 'Bank Transfer', notes: 'Emergency fund withdrawal' },
    { id: 2, date: '2025-08-15', type: 'deposit', amount: 1000, party: 'Jane Smith', status: 'Completed', method: 'Mobile Money', notes: 'Salary deposit' },
    { id: 3, date: '2025-08-10', type: 'transfer_to', amount: 200, party: 'Bank ABC', status: 'Pending', method: 'Bank Transfer', notes: 'Bill payment' },
    { id: 4, date: '2025-07-20', type: 'withdraw', amount: 400, party: 'Mary Johnson', status: 'Completed', method: 'Cash', notes: 'Personal expense' },
    { id: 5, date: '2025-07-01', type: 'loan_payment', amount: 600, party: 'Loan Dept', status: 'Failed', method: 'Bank Transfer', notes: 'Loan repayment attempt' },
    { id: 6, date: '2025-06-25', type: 'deposit', amount: 800, party: 'Peter Brown', status: 'Completed', method: 'Mobile Money', notes: 'Business income' },
    { id: 7, date: '2025-06-10', type: 'transfer_from', amount: 300, party: 'Bank XYZ', status: 'Completed', method: 'Bank Transfer', notes: 'Refund' },
    { id: 8, date: '2025-05-30', type: 'withdraw', amount: 150, party: 'Sarah Wilson', status: 'Pending', method: 'Cash', notes: 'Shopping' },
    { id: 9, date: '2025-05-15', type: 'deposit', amount: 1200, party: 'David Lee', status: 'Completed', method: 'Bank Transfer', notes: 'Freelance payment' },
    { id: 10, date: '2025-05-01', type: 'transfer_to', amount: 700, party: 'Bank ABC', status: 'Completed', method: 'Bank Transfer', notes: 'Utility bill' },
    { id: 11, date: '2025-04-20', type: 'withdraw', amount: 450, party: 'Emma Davis', status: 'Completed', method: 'Cash', notes: 'Medical expense' },
    { id: 12, date: '2025-04-10', type: 'loan_payment', amount: 900, party: 'Bank XYZ', status: 'Pending', method: 'Bank Transfer', notes: 'Car loan repayment' },
    { id: 13, date: '2025-03-25', type: 'deposit', amount: 2000, party: 'Michael Chen', status: 'Completed', method: 'Mobile Money', notes: 'Investment return' },
    { id: 14, date: '2025-03-15', type: 'withdraw', amount: 550, party: 'Lisa Brown', status: 'Completed', method: 'Bank Transfer', notes: 'Home improvement' },
    { id: 15, date: '2025-03-01', type: 'transfer_from', amount: 300, party: 'Bank ABC', status: 'Completed', method: 'Bank Transfer', notes: 'Gift received' },
    { id: 16, date: '2025-02-20', type: 'withdraw', amount: 400, party: 'James Wilson', status: 'Completed', method: 'Cash', notes: 'Event expense' },
    { id: 17, date: '2025-02-10', type: 'loan_payment', amount: 650, party: 'Bank XYZ', status: 'Completed', method: 'Bank Transfer', notes: 'Loan repayment' },
    { id: 18, date: '2025-01-30', type: 'deposit', amount: 1500, party: 'Anna Taylor', status: 'Pending', method: 'Mobile Money', notes: 'Bonus deposit' },
    { id: 19, date: '2025-01-15', type: 'transfer_to', amount: 500, party: 'Bank ABC', status: 'Completed', method: 'Bank Transfer', notes: 'Rent payment' },
    { id: 20, date: '2025-01-01', type: 'withdraw', amount: 300, party: 'Tom Harris', status: 'Completed', method: 'Cash', notes: 'Miscellaneous' },
  ];

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(
    (item) =>
      item.party.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.method.toLowerCase().includes(search.toLowerCase()) ||
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

  return (
    <div className="p-4 w-full min-h-screen bg-white">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Transaction History</h3>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by party, type, status, or method..."
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
                <th className="p-3 font-semibold">Method</th>
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
                  <td className="p-3">${item.amount.toLocaleString()}</td>
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