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
  const [loading, setLoading] = useState(true);
  const [coveredMonths, setCoveredMonths] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatMonthKey = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? null
      : `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const usersRes = await fetch('https://savings-loan-app.vercel.app/api/get-all-users');
      const usersData = await usersRes.json();

      const monthSet = new Set();
      const userMonthly = {};

      if (usersRes.status === 200) {
        setTotalMembers(usersData.length);

        usersData.forEach((user) => {
          const key = formatMonthKey(user.createdAt || user.dateCreated);
          if (key) {
            userMonthly[key] = (userMonthly[key] || 0) + 1;
            monthSet.add(key);
          }
        });

        const sortedUserKeys = Object.keys(userMonthly).sort((a, b) => {
          const [monthA, yearA] = a.split('-');
          const [monthB, yearB] = b.split('-');
          return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
        });

        const userChart = sortedUserKeys.map((key) => ({
          label: key,
          count: userMonthly[key],
        }));

        setMemberGrowth(userChart);
      } else {
        toast.error(usersData.error || 'Failed to load users.');
      }

      const txRes = await fetch('https://savings-loan-app.vercel.app/api/get-all-members-transactions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const txData = await txRes.json();

      const transactions = Array.isArray(txData) ? txData : txData.transaction_details || [];

      if (txRes.status === 200 && Array.isArray(transactions)) {
        setTotalTransactions(transactions.length);

        const monthlyTotals = {};
        let total = 0;

        transactions.forEach((tx) => {
          const key = formatMonthKey(tx.dateCreated);
          if (key) {
            if (!monthlyTotals[key]) {
              monthlyTotals[key] = { savings: 0, loans: 0 };
            }
            monthlyTotals[key].savings += tx.savingAmount || 0;
            monthlyTotals[key].loans += tx.loanAmount || 0;
            total += (tx.savingAmount || 0) + (tx.loanAmount || 0);
            monthSet.add(key);
          }
        });

        const sortedTxKeys = Object.keys(monthlyTotals).sort((a, b) => {
          const [monthA, yearA] = a.split('-');
          const [monthB, yearB] = b.split('-');
          return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
        });

        const txChart = sortedTxKeys.map((key) => ({
          label: key,
          savings: monthlyTotals[key].savings,
          loans: monthlyTotals[key].loans,
        }));

        setMonthlyTransactions(txChart);
        setTotalAmount(total);
        setCoveredMonths(Array.from(monthSet).sort((a, b) => {
          const [monthA, yearA] = a.split('-');
          const [monthB, yearB] = b.split('-');
          return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
        }));
      } else {
        toast.error(txData.error || 'Failed to load transactions.');
      }
    } catch (err) {
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
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
    <div className="w-full max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {loading ? (
        <div className="text-center py-10 text-orange-600 font-medium text-lg">
          Loading dashboard data…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Total Members', value: totalMembers, color: 'text-orange-600' },
              { label: 'Total Transactions', value: totalTransactions, color: 'text-blue-600' },
              { label: 'Total Amount', value: `₦${totalAmount.toLocaleString()}`, color: 'text-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-4 rounded shadow text-center">
                <h2 className="text-lg font-semibold break-words">{stat.label}</h2>
                <p className={`text-xl font-bold ${stat.color} break-words whitespace-nowrap md:whitespace-normal`}>
                  {stat.value}
                </p>
              </div>
            ))}

            {/* Months Covered */}
            <div className="bg-white p-4 rounded shadow text-center">
              <h2 className="text-lg font-semibold break-words">Months Covered</h2>
              <div className="text-sm font-medium text-gray-700 mt-2 space-y-1">
                {coveredMonths.length === 0 ? (
                  <p>No months recorded</p>
                ) : (
                  coveredMonths.map((month) => (
                    <p key={month} className="break-words whitespace-nowrap md:whitespace-normal">
                      {month}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

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
        </>
      )}
    </div>
  );
};

export default Dashboard;
