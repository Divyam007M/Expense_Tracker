import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

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

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];

function ExpenseList({ expenses, onDeleteExpense, onEditExpense, currencyFilter = 'all', onCurrencyFilterChange }) {
  const [filter, setFilter] = useState('All');
  const { formatOriginalAmount } = useCurrency();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Detect which currencies exist in the current expense set
  const availableCurrencies = [...new Set((expenses || []).map(e => e.currency || 'INR'))];

  const filteredExpenses = (expenses || []).filter((expense) => {
    const categoryMatch = filter === 'All' || expense.category === filter;
    const currencyMatch = currencyFilter === 'all' || (expense.currency || 'INR') === currencyFilter;
    return categoryMatch && currencyMatch;
  });

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Transactions</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="categoryFilter" className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                Category:
              </label>
              <select
                id="categoryFilter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 py-1.5 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 shadow-sm"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Currency Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="currencyFilter" className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                Currency:
              </label>
              <select
                id="currencyFilter"
                value={currencyFilter}
                onChange={(e) => onCurrencyFilterChange && onCurrencyFilterChange(e.target.value)}
                className="block rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 py-1.5 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 shadow-sm"
              >
                <option value="all">All Currencies</option>
                {CURRENCIES.filter(c => availableCurrencies.includes(c)).map(cur => (
                  <option key={cur} value={cur}>{cur}</option>
                ))}
              </select>

              {/* Active currency badge */}
              {currencyFilter !== 'all' && (
                <button
                  onClick={() => onCurrencyFilterChange && onCurrencyFilterChange('all')}
                  className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-2 py-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                  title="Clear currency filter"
                >
                  {currencyFilter}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter summary */}
        {(filter !== 'All' || currencyFilter !== 'all') && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Showing <span className="font-semibold text-indigo-600 dark:text-indigo-400">{sortedExpenses.length}</span> of <span className="font-semibold">{expenses.length}</span> transactions</span>
            {filter !== 'All' && (
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{filter}</span>
            )}
            {currencyFilter !== 'all' && (
              <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">{currencyFilter}</span>
            )}
          </div>
        )}
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-gray-900 min-h-[300px] flex flex-col justify-center items-center flex-grow">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {expenses.length === 0 ? "No expenses logged yet" : "No expenses match your filters"}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            {expenses.length === 0
              ? "Start adding expenses to see your list here."
              : `Try changing the ${currencyFilter !== 'all' ? 'currency or ' : ''}category filter.`}
          </p>
        </div>
      ) : (
        <div className="flex-grow">
          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
            {sortedExpenses.map((expense) => (
              <div key={expense.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 break-words">
                        {expense.category}
                      </span>
                      <span className="px-2 py-0.5 inline-flex text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                        {expense.currency || 'INR'}
                      </span>
                      <span
                        className="font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                        title={expense.id}
                        onClick={() => handleCopy(expense.id)}
                      >
                        {(expense.id?.toString() || '').substring(0, 8)}
                        {copiedId === expense.id ? (
                          <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        )}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{expense.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">{formatOriginalAmount(expense.amount, expense.currency || 'INR')}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate pr-4">{expense.note || 'No note details'}</p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      title="Edit expense"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete expense"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Currency</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2 group">
                        <span className="font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs" title={expense.id}>
                          {(expense.id?.toString() || '').substring(0, 8)}
                        </span>
                        <button
                          onClick={() => handleCopy(expense.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy full ID"
                        >
                          {copiedId === expense.id ? (
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{expense.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{expense.note || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                        {expense.currency || 'INR'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{formatOriginalAmount(expense.amount, expense.currency || 'INR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEditExpense(expense)}
                          className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-md transition-colors"
                          title="Edit expense"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-md transition-colors"
                          title="Delete expense"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
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
