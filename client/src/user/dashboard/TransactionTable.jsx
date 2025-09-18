// import React, { useState } from 'react';
// import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

// const TransactionTable = ({ transactions }) => {
//   const [search, setSearch] = useState('');
//   const [filter, setFilter] = useState('all');

//   const filteredTransactions = transactions.filter((tx) =>
//     (filter === 'all' || tx.type === filter) &&
//     (tx.name.toLowerCase().includes(search.toLowerCase()) || tx.type.toLowerCase().includes(search.toLowerCase()))
//   );

//   return (
//     <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 w-[100%]">
//       <h3 className="text-lg font-semibold text-gray-700 mb-4">Transaction History</h3>
//       <div className="flex flex-col sm:flex-row gap-4 mb-4">
//         <div className="relative flex-1">
//           <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search transactions..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
//           />
//         </div>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brandBlue"
//         >
//           <option value="all">All Types</option>
//           <option value="withdraw">Withdraw</option>
//           <option value="save">Save</option>
//           <option value="transfer_to">Transfer To</option>
//           <option value="transfer_from">Transfer From</option>
//           <option value="loan">Loan</option>
//         </select>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <thead>
//             <tr className="text-gray-700 font-semibold">
//               <th className="p-2">S/N</th>
//               <th className="p-2">Name</th>
//               <th className="p-2">Type</th>
//               <th className="p-2">Amount</th>
//               <th className="p-2">Date</th>
//               <th className="p-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTransactions.map((tx, index) => (
//               <tr key={tx.id} className="border-t border-gray-200">
//                 <td className="p-2">{index + 1}</td>
//                 <td className="p-2">{tx.name}</td>
//                 <td className="p-2">{tx.type}</td>
//                 <td className="p-2">${tx.amount.toLocaleString()}</td>
//                 <td className="p-2">{tx.date}</td>
//                 <td className="p-2">
//                   <span
//                     className={`px-2 py-1 rounded-full text-sm ${
//                       tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                     }`}
//                   >
//                     {tx.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TransactionTable;






import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const TransactionTable = ({ transactions }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(
    (tx) =>
      (filter === 'all' || tx.type === filter) &&
      (tx.party.toLowerCase().includes(search.toLowerCase()) || tx.type.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Transaction History</h3>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brandBlue"
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="loan">Loan</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-700 font-semibold">
              <th className="p-2">S/N</th>
              <th className="p-2">Description</th>
              <th className="p-2">Type</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, index) => (
              <tr key={tx.id} className="border-t border-gray-200">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{tx.party}</td>
                <td className="p-2 capitalize">{tx.type}</td>
                <td className="p-2">₦{tx.amount.toLocaleString()}</td>
                <td className="p-2">{tx.date}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;