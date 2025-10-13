import React from 'react';
import { CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { differenceInDays, format } from 'date-fns';

const BalanceCards = ({ balances }) => {
  // Calculate time left for loan due date
  const getTimeLeft = (dueDate) => {
    if (!dueDate || balances.loan === 0) return ' 1 months';
    const daysLeft = differenceInDays(new Date(dueDate), new Date());
    if (daysLeft < 0) return 'Overdue';
    return `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
  };
//change icon to naira icon 
  const cards = [
    {
      title: 'Total Balance',
      amount: balances.savings,
      //change to naira icon 

      icon: CurrencyDollarIcon,
      color: 'text-blue-500',
    },
    {
      title: 'Savings Balance',
      amount: balances.savings,
      icon: CurrencyDollarIcon,
      color: 'text-orange-700',
    },
    {
      title: 'Loan Balance',
      amount: balances.loan,
      icon: DocumentTextIcon,
      color: 'text-red-500',
      interestRate: balances.loanInterestRate || 0,
      timeLeft: getTimeLeft(balances.loanDueDate),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-white border border-gray-200 shadow-2xl rounded-xl p-6 flex flex-col justify-between relative ${card.color}`}
        >
          {card.title === 'Loan Balance' && (
            <>
              <div className="absolute bg-white px-2 border rounded-lg -top-2 right-2 text-sm text-red-500">
                {card.interestRate > 0 ? `${card.interestRate}% p.a.` : '0.5%'}
              </div>
              <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                {card.timeLeft}
              </div>
            </>
          )}
          <div className="flex items-center gap-4">           
            {/* {card.title !== 'Loan Balance' && (
            )}                       */}
             <span className="text-4xl flex items-center justify-center w-16 h-16 p-1 font-bold text-{cards.color} rounded-full ">₦</span>

            {/* {card.title ==='Loan Balance' && (
                        <card.icon className={``} />
   )} */}

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
        </div>
      ))}
    </div>
  );
};

export default BalanceCards;