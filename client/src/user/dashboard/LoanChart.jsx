import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LoanChart = ({ data = [] }) => {
  useEffect(() => {
    console.log('LoanChart data:', data);
  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('LoanChart: Invalid or empty data');
    return (
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Balance (Last 12 Months)</h3>
        <p className="text-gray-600">No loan data available</p>
      </div>
    );
  }

  // Validate data structure
  const isValidData = data.every(item => item.month && typeof item.amount === 'number');
  if (!isValidData) {
    console.error('LoanChart: Invalid data structure', data);
    return (
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Balance (Last 12 Months)</h3>
        <p className="text-gray-600">Invalid loan data format</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Balance (Last 12 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoanChart;