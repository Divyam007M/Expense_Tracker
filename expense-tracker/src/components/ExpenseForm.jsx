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
  const [isCategorising, setIsCategorising] = useState(false);

  const [errors, setErrors] = useState({});

  const handleMagicCategorise = async () => {
    if (!note.trim()) return;
    
    setIsCategorising(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerNote = note.toLowerCase();
    let suggestedCategory = 'Other';
    
    if (lowerNote.includes('burger') || lowerNote.includes('food') || lowerNote.includes('lunch') || lowerNote.includes('dinner') || lowerNote.includes('coffee') || lowerNote.includes('grocery') || lowerNote.includes('restaurant')) {
      suggestedCategory = 'Food & Drink';
    } else if (lowerNote.includes('uber') || lowerNote.includes('taxi') || lowerNote.includes('bus') || lowerNote.includes('train') || lowerNote.includes('gas') || lowerNote.includes('flight') || lowerNote.includes('lyft') || lowerNote.includes('fuel')) {
      suggestedCategory = 'Transport';
    } else if (lowerNote.includes('rent') || lowerNote.includes('mortgage') || lowerNote.includes('hotel') || lowerNote.includes('airbnb') || lowerNote.includes('utility') || lowerNote.includes('electricity') || lowerNote.includes('water')) {
      suggestedCategory = 'Housing';
    } else if (lowerNote.includes('doctor') || lowerNote.includes('medicine') || lowerNote.includes('pharmacy') || lowerNote.includes('hospital') || lowerNote.includes('gym') || lowerNote.includes('fitness')) {
      suggestedCategory = 'Health';
    } else if (lowerNote.includes('movie') || lowerNote.includes('game') || lowerNote.includes('concert') || lowerNote.includes('ticket') || lowerNote.includes('subscription') || lowerNote.includes('netflix') || lowerNote.includes('spotify')) {
      suggestedCategory = 'Entertainment';
    } else if (lowerNote.includes('shirt') || lowerNote.includes('shoes') || lowerNote.includes('amazon') || lowerNote.includes('mall') || lowerNote.includes('clothes') || lowerNote.includes('apparel')) {
      suggestedCategory = 'Shopping';
    } else if (lowerNote.includes('book') || lowerNote.includes('course') || lowerNote.includes('tuition') || lowerNote.includes('school')) {
      suggestedCategory = 'Education';
    }
    
    setCategory(suggestedCategory);
    setIsCategorising(false);
  };

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
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note</label>
            <button
              type="button"
              onClick={handleMagicCategorise}
              disabled={isCategorising || !note.trim()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCategorising ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </>
              ) : (
                <>
                  <svg className="w-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Magic Categorise
                </>
              )}
            </button>
          </div>
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
