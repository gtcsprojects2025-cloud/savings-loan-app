import React from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  BanknotesIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ activeTab, setActiveTab, toggleSidebar }) => {
  const tabs = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'View Members', icon: UserGroupIcon },
    { name: 'Create Account', icon: UserPlusIcon },
    { name: 'Transactions', icon: BanknotesIcon },
    { name: 'TransactionHistory', icon: ClipboardDocumentListIcon },
    { name: 'Notifications', icon: ClipboardDocumentListIcon },
    { name: 'Logout', icon: ArrowRightOnRectangleIcon },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col bg-gray-100 shadow-md z-50">
      {/* Header */}
      <div className="border-b border-orange-500 p-6 flex flex-col items-center justify-center bg-white">
        <img src="/logo.jpg" alt="Company Logo" className="h-12 mb-2" />
        <h1 className="text-sm font-bold text-orange-600 tracking-wide">GTCS ADMIN PANEL</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name);
              if (typeof toggleSidebar === 'function') toggleSidebar();
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
              activeTab === tab.name
                ? 'bg-orange-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{tab.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <footer className="p-4 text-xs text-center text-gray-500 border-t bg-white">
        &copy; {new Date().getFullYear()} GTCS Corporative Admin
      </footer>
    </aside>
  );
};

export default Sidebar;
