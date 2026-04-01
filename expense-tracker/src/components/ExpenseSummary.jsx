import React from 'react';

function ExpenseSummary({ expenses }) {
  const total = (expenses || []).reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg rounded-xl p-6 text-white border border-blue-500">
      <h2 className="text-sm font-medium text-blue-100 uppercase tracking-wider mb-2">Total Balance</h2>
      <div className="text-4xl font-extrabold tracking-tight">
        ${total.toFixed(2)}
      </div>
      <div className="mt-4 flex items-center text-sm text-blue-100 bg-blue-800/30 w-max px-3 py-1 rounded-full">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Ready to start tracking
      </div>
    </div>
  );
}

export default ExpenseSummary;
