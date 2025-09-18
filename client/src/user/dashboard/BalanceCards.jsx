import React from 'react';
import { CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const BalanceCards = ({ balances }) => {
  const cards = [
    { title: 'Savings Balance', amount: balances.savings, icon: CurrencyDollarIcon, color: 'bg-brandOrange' },
    { title: 'Loan Balance', amount: balances.loan, icon: DocumentTextIcon, color: 'bg-red-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-white border border-gray-200 shadow-2xl rounded-xl p-6 flex items-center gap-4 ${card.color}`}
        >
          <card.icon className="h-8 w-8 text-black" />
          <div>
            <h3 className="text-lg font-semibold text-gray-500">{card.title}</h3>
            <p className="text-2xl font-bold text-black flex items-center">
              {card.title === 'Loan Balance' && balances.loan > 0 && (
                <span className="text-red-400 mr-1">-</span>
              )}
              ₦{card.amount.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BalanceCards;