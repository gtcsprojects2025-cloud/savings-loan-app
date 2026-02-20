import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, parseISO } from 'date-fns';

// Retry fetch with exponential backoff
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

const LoanChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const email = localStorage.getItem('email');

  // Function to fetch transactions from the API
  const fetchTransactions = useCallback(async () => {
    if (!email) {
      setError('No email found in localStorage');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching transactions for email:', email);
      const response = await fetchWithRetry(
        `https://admin.gtcooperative.com/api/get-transaction-history?email=${email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('userToken')}', // Uncomment if needed
          },
        }
      );
      const result = await response.json();
      console.log('Transaction API response:', JSON.stringify(result, null, 2));

      if (response.ok && Array.isArray(result.transaction_details)) {
        const transformedTransactions = result.transaction_details.map((tx, index) => {
          const txDate = parseISO(tx.dateCreated);
          console.log('Processing transaction:', {
            id: tx._id,
            dateCreated: tx.dateCreated,
            parsedDate: format(txDate, 'yyyy-MM-dd'),
            loanAmount: tx.loanAmount,
            transactionType: tx.transactionType,
          });
          return {
            id: tx._id || `tx-${index + 1}`,
            date: format(txDate, 'yyyy-MM-dd'),
            type: tx.transactionType?.toLowerCase() || 'unknown',
            amount: Number(tx.loanAmount) || 0, // Ensure number for loans
            party: tx.comment || 'N/A',
            status: tx.status || 'Completed',
            notes: tx.comment || 'No notes',
          };
        });
        console.log('Transformed transactions:', transformedTransactions);
        processChartData(transformedTransactions);
      } else {
        console.warn('No transaction data found:', result.message || 'Empty response');
        setData([]);
      }
    } catch (err) {
      console.error('Transaction fetch error:', err.message);
      setError(`Failed to load transactions: ${err.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [email]);

  // Function to process transactions for the loan chart
  const processChartData = (transactions) => {
    if (!transactions || !Array.isArray(transactions)) {
      console.warn('No valid transactions to process');
      setData([]);
      return;
    }

    // Get the start of the current month and 12 months ago
    const today = new Date();
    const twelveMonthsAgo = subMonths(startOfMonth(today), 12);
    console.log('Date range:', {
      today: format(today, 'yyyy-MM-dd'),
      twelveMonthsAgo: format(twelveMonthsAgo, 'yyyy-MM-dd'),
    });

    // Initialize an array for the last 12 months (oldest to newest)
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(startOfMonth(today), 11 - i);
      return {
        month: format(date, 'MMM yyyy'),
        amount: 0,
      };
    });

    // Filter loan transactions
    const loanTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const isValid =
        tx.amount > 0 &&
        txDate >= twelveMonthsAgo &&
        !isNaN(txDate.getTime());
      console.log('Checking transaction:', {
        date: tx.date,
        amount: tx.amount,
        isValid,
        txDate: format(txDate, 'yyyy-MM-dd'),
      });
      return isValid;
    });

    console.log('Filtered loan transactions:', loanTransactions);

    // Aggregate amounts by month
    loanTransactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const monthKey = format(startOfMonth(txDate), 'MMM yyyy');
      const monthEntry = months.find((m) => m.month === monthKey);
      if (monthEntry) {
        monthEntry.amount += tx.amount;
      }
    });

    console.log('Processed chart data:', months);
    setData(months);
  };

  useEffect(() => {
    if (email) {
      fetchTransactions();
    } else {
      console.warn('No email found in localStorage');
      setError('Email is required');
    }
  },[fetchTransactions] );

  useEffect(() => {
    console.log('LoanChart final data:', data);
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Balance (Last 12 Months)</h3>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Balance (Last 12 Months)</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6 w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Balance (Last 12 Months)</h3>
        <p className="text-gray-600">No loan data available</p>
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