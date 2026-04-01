import React, { useState } from 'react';

const CATEGORIES = [
  'Food & Drink',
  'Transport',
  'Housing',
  'Health',
  'Entertainment',
  'Shopping',
  'Education',
  'Other'
];

function ExpenseList({ expenses, onDeleteExpense }) {
  const [filter, setFilter] = useState('All');

  const filteredExpenses = (expenses || []).filter(
    (expense) => filter === 'All' || expense.category === filter
  );

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100 h-full flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="categoryFilter" className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</label>
          <select
            id="categoryFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full sm:w-auto rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white border shadow-sm"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="p-8 text-center bg-white min-h-[300px] flex flex-col justify-center items-center flex-grow">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="text-gray-500 font-medium">{expenses.length === 0 ? "No expenses logged yet" : "No expenses found"}</p>
          <p className="text-gray-400 text-sm mt-1">{expenses.length === 0 ? "Start adding expenses to see your list here." : "Try changing the category filter."}</p>
        </div>
      ) : (
        <div className="flex-grow">
          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {sortedExpenses.map((expense) => (
              <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mb-1">
                      {expense.category}
                    </span>
                    <p className="text-sm font-medium text-gray-900">{expense.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500 truncate pr-4">{expense.note || 'No note details'}</p>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors shrink-0"
                    title="Delete expense"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{expense.note || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                        title="Delete expense"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
