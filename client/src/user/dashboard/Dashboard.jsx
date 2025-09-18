import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Account from './Account';
import Saving from './Saving';
import TransactionHistory from './TransactionHistory';
import Loan from './Loan';
import Profile from './Profile';
import BankDetails from './BankDetails';
import Logout from './Logout';
import { format } from 'date-fns';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <h2 className="text-red-500 text-2xl font-bold">Something went wrong.</h2>
          <pre className="text-sm text-gray-700">{this.state.error?.stack || this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Account');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({ firstName: 'John', lastName: 'Doe' });
  const [balances, setBalances] = useState({ savings: 0, loan: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = !!localStorage.getItem('userToken');
  const email = localStorage.getItem('email') || 'rolandmario2@gmail.com';
  const userToken = localStorage.getItem('userToken') || 'demo-token';

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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/Auth/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user details
        const userResponse = await fetchWithRetry(
          `https://savings-loan-app.vercel.app/api/get-user?email=${email}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
            },
          }
        );
        const userResult = await userResponse.json();
        if (userResponse.ok && userResult.user) {
          setUserData({
            firstName: userResult.user.firstName || 'John',
            lastName: userResult.user.lastName || 'Doe',
          });
        } else {
          throw new Error(
            userResult.message || `Failed to fetch user data (Status: ${userResponse.status})`
          );
        }

        // Fetch user amounts
        const amountResponse = await fetchWithRetry(
          `https://savings-loan-app.vercel.app/api/get-user-amount?email=${email}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
            },
          }
        );
        const amountResult = await amountResponse.json();
        if (amountResponse.ok && amountResult.fetch_details) {
          setBalances({
            savings: amountResult.fetch_details.savingAmount || 0,
            loan: amountResult.fetch_details.loanAmount || 0,
          });
        } else {
          throw new Error(
            amountResult.message || `Failed to fetch amounts (Status: ${amountResponse.status})`
          );
        }

        // Fetch transaction history
        const transactionResponse = await fetchWithRetry(
          `https://savings-loan-app.vercel.app/api/get-transaction-history?email=${email}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
            },
          }
        );
        const transactionResult = await transactionResponse.json();
        if (transactionResponse.ok && transactionResult.transaction_details) {
          const transformedTransactions = transactionResult.transaction_details.map((tx, index) => ({
            id: tx._id || `tx-${index + 1}`,
            date: format(new Date(tx.dateCreated), 'yyyy-MM-dd'),
            type: tx.transactionType?.toLowerCase() || 'unknown',
            amount: tx.savingAmount || tx.loanAmount || 0,
            party: tx.comment || 'N/A',
            status: tx.status || 'Completed',
            notes: tx.comment || 'No notes',
          }));
          setTransactions(transformedTransactions);
        } else {
          throw new Error(
            transactionResult.message || `Failed to fetch transactions (Status: ${transactionResponse.status})`
          );
        }
      } catch (error) {
        console.error('Dashboard fetch error:', {
          message: error.message,
          status: error.status,
          endpoint: 'https://savings-loan-app.vercel.app/api/get-user',
          email,
          token: userToken,
        });
        setError(`Failed to load data: ${error.message}. Using demo data.`);
        setUserData({ firstName: 'John', lastName: 'Doe' });
        setBalances({ savings: 89000, loan: 0 });
        setTransactions([
          {
            id: '68c93e1d6978ac95e8c5dd90',
            date: '2025-09-16',
            type: 'deposit',
            amount: 50000,
            party: 'First deposit',
            status: 'Completed',
            notes: 'First deposit',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, email, userToken, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Account':
        return (
          <Account
            user={userData}
            balances={balances}
            transactions={transactions}
            setActiveTab={setActiveTab}
          />
        );
      case 'Start Saving':
        return <Saving />;
      case 'Transaction History':
        return <TransactionHistory transactions={transactions} />;
      case 'Loan App':
        return <Loan />;
      case 'Profile':
        return <Profile />;
      case 'Bank Details':
        return <BankDetails />;
      case 'Logout':
        return <Logout />;
      default:
        return (
          <Account
            user={userData}
            balances={balances}
            transactions={transactions}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-[100%]">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-brandOrange text-white rounded-lg"
        >
          {isSidebarOpen ? 'x' : '='}
        </button>
        <div
          className={`fixed top-0 left-0 h-full w-64 lg:w-[20%] transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 bg-white shadow-lg`}
        >
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            toggleSidebar={() => setIsSidebarOpen(false)}
          />
        </div>
        <div className="lg:w-[80%] lg:ml-[20%] p-0">{renderContent()}</div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;