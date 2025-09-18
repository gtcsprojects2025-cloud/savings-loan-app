// import React, { useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const SavingsChart = ({ data = [] }) => {
//   useEffect(() => {
//     console.log('SavingsChart data:', data);
//   }, [data]);

//   if (!data || !Array.isArray(data) || data.length === 0) {
//     console.warn('SavingsChart: Invalid or empty data');
//     return (
//       <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Savings Rate (Last 12 Months)</h3>
//         <p className="text-gray-600">No savings data available</p>
//       </div>
//     );
//   }

//   // Validate data structure
//   const isValidData = data.every(item => item.month && typeof item.amount === 'number');
//   if (!isValidData) {
//     console.error('SavingsChart: Invalid data structure', data);
//     return (
//       <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Savings Rate (Last 12 Months)</h3>
//         <p className="text-gray-600">Invalid savings data format</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
//       <h3 className="text-lg font-semibold text-gray-700 mb-4">Savings Rate (Last 12 Months)</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default SavingsChart;

import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SavingsChart = ({ data = [] }) => {
  useEffect(() => {
    console.log('SavingsChart data:', data);
  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Savings Rate (Last 12 Months)</h3>
        <p className="text-gray-600">No savings data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Savings Rate (Last 12 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsChart;