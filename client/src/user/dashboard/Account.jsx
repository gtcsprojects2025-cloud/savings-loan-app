import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import WelcomeCard from './WelcomeCard';
import BalanceCards from './BalanceCards';
import SavingsChart from './SavingsChart';
import LoanChart from './LoanChart';

const Account = ({
  user = { firstName: 'John', lastName: 'Doe' },
  balances = { account: 5000, savings: 12000, loan: 3000 },
  savingsData = [],
  loanData = [],
  setActiveTab, // Passed from Dashboard.jsx to switch tabs
}) => {
  const [search, setSearch] = useState('');
  const [modalItem, setModalItem] = useState(null);

  // Demo transaction data (first 5 from TransactionHistory.jsx)
  const transactions = [
    { id: 1, date: '2025-09-01', type: 'withdraw', amount: 500, party: 'John Doe', status: 'Completed', method: 'Bank Transfer', notes: 'Emergency fund withdrawal' },
    { id: 2, date: '2025-08-15', type: 'deposit', amount: 1000, party: 'Jane Smith', status: 'Completed', method: 'Mobile Money', notes: 'Salary deposit' },
    { id: 3, date: '2025-08-10', type: 'transfer_to', amount: 200, party: 'Bank ABC', status: 'Pending', method: 'Bank Transfer', notes: 'Bill payment' },
    { id: 4, date: '2025-07-20', type: 'withdraw', amount: 400, party: 'Mary Johnson', status: 'Completed', method: 'Cash', notes: 'Personal expense' },
    { id: 5, date: '2025-07-01', type: 'loan_payment', amount: 600, party: 'Loan Dept', status: 'Failed', method: 'Bank Transfer', notes: 'Loan repayment attempt' },
  ];

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(
    (item) =>
      item.party.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.method.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 w-full min-h-screen bg-white">
      <WelcomeCard user={user} />
      <BalanceCards balances={balances} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
         <SavingsChart data={savingsData} />
        <LoanChart data={loanData} />
      </div>
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h3>
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
              {filteredTransactions.slice(0, 5).map((item) => (
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
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setActiveTab('Transaction History')}
            className="px-4 py-2 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Check More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;