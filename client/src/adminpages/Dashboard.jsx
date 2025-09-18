import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import { toast } from 'react-toastify';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const [memberGrowth, setMemberGrowth] = useState([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const usersRes = await fetch('https://savings-loan-app.vercel.app/api/get-all-users');
      const usersData = await usersRes.json();

      if (usersRes.status === 200) {
        setTotalMembers(usersData.length);

        const userMonthly = {};
        usersData.forEach((user) => {
          const date = new Date(user.createdAt || user.dateCreated);
          const key = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
          userMonthly[key] = (userMonthly[key] || 0) + 1;
        });

        const sortedUserKeys = Object.keys(userMonthly).sort((a, b) => new Date(a) - new Date(b));
        const userChart = sortedUserKeys.map((key) => ({
          label: key,
          count: userMonthly[key],
        }));

        setMemberGrowth(userChart);
      } else {
        toast.error(usersData.error || 'Failed to load users.');
      }

      const txRes = await fetch('https://savings-loan-app.vercel.app/api/get-transaction-history', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '' }),
      });

      const txData = await txRes.json();

      if (txRes.status === 200) {
        const transactions = txData.transaction_details || [];
        setTotalTransactions(transactions.length);

        const monthlyTotals = {};
        let total = 0;

        transactions.forEach((tx) => {
          const date = new Date(tx.dateCreated);
          const key = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;

          if (!monthlyTotals[key]) {
            monthlyTotals[key] = { savings: 0, loans: 0 };
          }

          monthlyTotals[key].savings += tx.savingAmount || 0;
          monthlyTotals[key].loans += tx.loanAmount || 0;
          total += (tx.savingAmount || 0) + (tx.loanAmount || 0);
        });

        const sortedTxKeys = Object.keys(monthlyTotals).sort((a, b) => new Date(a) - new Date(b));
        const txChart = sortedTxKeys.map((key) => ({
          label: key,
          savings: monthlyTotals[key].savings,
          loans: monthlyTotals[key].loans,
        }));

        setMonthlyTransactions(txChart);
        setTotalAmount(total);
      } else {
        toast.error(txData.error || 'Failed to load transactions.');
      }
    } catch (err) {
      toast.error('Server error. Please try again.');
    }
  };

  const memberChartConfig = {
    labels: memberGrowth.map((d) => d.label),
    datasets: [
      {
        label: 'New Members',
        data: memberGrowth.map((d) => d.count),
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.2)',
        tension: 0.4,
      },
    ],
  };

  const transactionChartConfig = {
    labels: monthlyTransactions.map((d) => d.label),
    datasets: [
      {
        label: 'Savings',
        data: monthlyTransactions.map((d) => d.savings),
        borderColor: 'green',
        backgroundColor: 'rgba(0,128,0,0.2)',
        tension: 0.4,
      },
      {
        label: 'Loans',
        data: monthlyTransactions.map((d) => d.loans),
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Members</h2>
          <p className="text-2xl font-bold text-orange-600">{totalMembers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Transactions</h2>
          <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Amount</h2>
          <p className="text-2xl font-bold text-green-600">₦{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Months Covered</h2>
          <p className="text-2xl font-bold text-gray-700">
            {new Set([...memberGrowth.map((d) => d.label), ...monthlyTransactions.map((d) => d.label)]).size}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Member Growth</h3>
          <Line data={memberChartConfig} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Monthly Savings & Loans</h3>
          <Line data={transactionChartConfig} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
