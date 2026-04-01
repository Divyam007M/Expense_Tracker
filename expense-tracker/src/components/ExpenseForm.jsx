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

function ExpenseForm({ onAddExpense }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const expenseData = {
        amount: parseFloat(amount),
        category,
        date,
        note
      };
      
      onAddExpense(expenseData);
      
      // Clear form
      setAmount('');
      setCategory('');
      setDate('');
      setNote('');
      setErrors({});
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount <span className="text-red-500">*</span></label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input 
              type="number" 
              step="0.01"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`block w-full rounded-md border pl-7 pr-3 focus:ring-blue-500 sm:text-sm px-4 py-2 shadow-sm ${errors.amount ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 bg-white'}`} 
              placeholder="0.00" 
            />
          </div>
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`mt-1 block w-full rounded-md border focus:ring-blue-500 sm:text-sm px-4 py-2 shadow-sm ${errors.category ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 bg-white'}`}
          >
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`mt-1 block w-full rounded-md border focus:ring-blue-500 sm:text-sm px-4 py-2 shadow-sm ${errors.date ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 bg-white'}`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note</label>
          <textarea
            id="note"
            rows="2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 bg-white"
            placeholder="Optional notes"
          />
        </div>

        <button 
          type="submit" 
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 transition-colors"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
