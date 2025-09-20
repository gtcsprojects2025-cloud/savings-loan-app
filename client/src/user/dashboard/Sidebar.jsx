import React from 'react';
import { HomeIcon, ChartBarIcon, CurrencyDollarIcon, ArrowRightOnRectangleIcon, UserIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ activeTab, setActiveTab, toggleSidebar }) => {
  const tabs = [
    { name: 'Account', icon: HomeIcon },
    // { name: 'Start Saving', icon: CurrencyDollarIcon },
    { name: 'Transaction History', icon: ChartBarIcon },
    { name: 'Loan App', icon: BanknotesIcon },
    { name: 'Profile', icon: UserIcon },
    { name: 'Bank Details', icon: BanknotesIcon },
    { name: 'Logout', icon: ArrowRightOnRectangleIcon },
  ];

  return (
    <div className="h-full bg-white shadow-lg w-full">
      <div className="py-4">
        <div className=" border-b-2 border-[#f97316] flex justify-center items-center pb-4 mb-1">
            <img src="/logo.jpg" alt="Company Logo" className="h-72 mb-4" />
</div>
        <nav className="space-y-2 bg-gray-100 h-screen mx-1  rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                toggleSidebar();
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 rounded-lg transition-colors ${
                activeTab === tab.name
                  ? 'bg-[#f97316] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;