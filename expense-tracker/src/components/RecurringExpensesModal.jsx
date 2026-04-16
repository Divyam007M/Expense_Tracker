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

function RecurringExpensesModal({ isOpen, onClose, recurringExpenses, onAddRecurring, onDeleteRecurring, onToggleRecurring }) {
  const { getSymbol } = useCurrency();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!category) newErrors.category = 'Category is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onAddRecurring({
        title,
        amount: parseFloat(amount),
        category,
        start_date: startDate,
        frequency: 'monthly',
        is_active: true
      });
      // Clear form
      setTitle('');
      setAmount('');
      setCategory('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-950 dark:bg-opacity-80 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100" id="modal-title">
                Recurring Expenses
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Add New Recurring Expense Form */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Add New Subscription</h4>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title (e.g. Netflix)</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                    className={`block w-full rounded-md border text-sm px-3 py-2 bg-white dark:bg-gray-800 dark:text-white ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  />
                  {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{getSymbol('INR')}</span>
                    </div>
                    <input 
                      type="number" 
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={`block w-full rounded-md border text-sm pl-8 pr-3 py-2 bg-white dark:bg-gray-800 dark:text-white ${errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                  </div>
                  {errors.amount && <p className="text-red-500 text-[10px] mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`block w-full rounded-md border text-sm px-3 py-2 bg-white dark:bg-gray-800 dark:text-white ${errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  {errors.category && <p className="text-red-500 text-[10px] mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`block w-full rounded-md border text-sm px-3 py-2 bg-white dark:bg-gray-800 dark:text-white ${errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  />
                  {errors.startDate && <p className="text-red-500 text-[10px] mt-1">{errors.startDate}</p>}
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors shadow-sm"
                  >
                    Add Recurring Expense
                  </button>
                </div>
              </form>
            </div>

            {/* List of Recurring Expenses */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Active Subscriptions</h4>
              <div className="overflow-hidden border border-gray-100 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700">
                {recurringExpenses.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 italic text-sm">
                    No recurring expenses added yet.
                  </div>
                ) : (
                  recurringExpenses.map(rec => (
                    <div key={rec.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${rec.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <div>
                          <p className={`text-sm font-bold ${rec.is_active ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                            {rec.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 uppercase">
                              {rec.category}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                              Monthly · Starts {rec.start_date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={`text-sm font-mono font-bold ${rec.is_active ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                          {getSymbol('INR')}{rec.amount.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => onToggleRecurring(rec.id, !rec.is_active)}
                            className={`p-1.5 rounded-md transition-colors ${rec.is_active ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                            title={rec.is_active ? 'Pause' : 'Activate'}
                          >
                            {rec.is_active ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                          </button>
                          <button 
                            onClick={() => onDeleteRecurring(rec.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecurringExpensesModal;
