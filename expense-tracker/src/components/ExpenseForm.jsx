import React from 'react';

function ExpenseForm() {
  return (
    <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">Add Expense</h2>
      <form className="space-y-4 text-left">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input 
            type="text" 
            id="description" 
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 bg-gray-50" 
            placeholder="e.g. Groceries" 
            readOnly
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input 
              type="number" 
              id="amount" 
              className="block w-full rounded-md border border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 shadow-sm bg-gray-50" 
              placeholder="0.00" 
              readOnly
            />
          </div>
        </div>
        <button 
          type="button" 
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 opacity-60 cursor-not-allowed mt-2"
          disabled
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
