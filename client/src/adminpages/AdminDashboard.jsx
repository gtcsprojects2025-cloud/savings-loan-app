import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './Dashboard';
import Members from './Members';
import Transactions from './Transactions';
import CreateAccount from './CreateAccount';
import TransactionHistory from './TransactionHistory';
import Logout from './Logout';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardHome />;
      case 'View Members':
        return <Members />;
      case 'CreateAccount':
        return <CreateAccount />;
      case 'Transactions':
        return <Transactions />;
      case 'TransactionHistory':
        return <TransactionHistory />;
      case 'Logout':
        return <Logout />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Mobile toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden p-3 bg-orange-500 text-white fixed top-4 left-4 z-50 rounded-md shadow-md"
      >
        {isSidebarOpen ? '✖' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:block`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleSidebar={() => setIsSidebarOpen(false)}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-4 p-4 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
