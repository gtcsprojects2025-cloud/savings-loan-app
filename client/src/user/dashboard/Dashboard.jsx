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

  // Demo auth check
  const isLoggedIn = !!localStorage.getItem('userToken');
  const userData = JSON.parse(localStorage.getItem('user')) || { firstName: 'John', lastName: 'Doe' };

  useEffect(() => {
    console.log('Dashboard: isLoggedIn=', isLoggedIn, 'userData=', userData);
    if (!isLoggedIn) {
      navigate('/Auth/login');
    }
  }, [isLoggedIn, navigate]);

  // Demo data
  const balances = {
    account: 5000,
    savings: 12000,
    loan: 3000,
  };

  const savingsData = [
    { month: 'Oct 24', amount: 1000 },
    { month: 'Nov 24', amount: 1200 },
    { month: 'Dec 24', amount: 800 },
    { month: 'Jan 25', amount: 1500 },
    { month: 'Feb 25', amount: 1700 },
    { month: 'Mar 25', amount: 1400 },
    { month: 'Apr 25', amount: 2000 },
    { month: 'May 25', amount: 1800 },
    { month: 'Jun 25', amount: 2200 },
    { month: 'Jul 25', amount: 1900 },
    { month: 'Aug 25', amount: 2500 },
    { month: 'Sep 25', amount: 2700 },
  ];

  const loanData = [
    { month: 'Oct 24', amount: 5000 },
    { month: 'Nov 24', amount: 4800 },
    { month: 'Dec 24', amount: 4600 },
    { month: 'Jan 25', amount: 4400 },
    { month: 'Feb 25', amount: 4200 },
    { month: 'Mar 25', amount: 4000 },
    { month: 'Apr 25', amount: 3800 },
    { month: 'May 25', amount: 3600 },
    { month: 'Jun 25', amount: 3400 },
    { month: 'Jul 25', amount: 3200 },
    { month: 'Aug 25', amount: 3100 },
    { month: 'Sep 25', amount: 3000 },
  ];

  const transactions = [
    { id: 1, name: 'John Doe', type: 'save', amount: 1000, date: '2025-09-01', status: 'Completed' },
    { id: 2, name: 'Jane Smith', type: 'withdraw', amount: 500, date: '2025-08-15', status: 'Completed' },
    { id: 3, name: 'Bank ABC', type: 'transfer_to', amount: 200, date: '2025-08-10', status: 'Completed' },
    { id: 4, name: 'Bank XYZ', type: 'transfer_from', amount: 300, date: '2025-07-20', status: 'Completed' },
    { id: 5, name: 'Loan Dept', type: 'loan', amount: 1000, date: '2025-07-01', status: 'Pending' },
  ];

  if (!isLoggedIn) {
    console.warn('Dashboard: Not logged in, redirecting to /');
    return null;
  }

  const renderContent = () => {
    console.log('Dashboard: Rendering tab=', activeTab);
    switch (activeTab) {
      case 'Account':
        return (
          <Account
            user={userData}
            balances={balances}
            savingsData={savingsData}
            loanData={loanData}
            transactions={transactions}
            setActiveTab={setActiveTab} // Pass setActiveTab
          />
        );
      case 'Start Saving':
        return <Saving />;
      case 'Transaction History':
        return <TransactionHistory />;
      case 'Loan App':
        return <Loan />;
      case 'Profile':
        return <Profile />;
      case 'Bank Details':
        return <BankDetails />;
      case 'Logout':
        return <Logout />;
      default:
        return <Account user={userData} balances={balances} savingsData={savingsData} loanData={loanData} transactions={transactions} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen  w-screen ">
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
        <div className=" lg:w-[80%]   lg:ml-[20%]  p-0"> 
          {renderContent()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;