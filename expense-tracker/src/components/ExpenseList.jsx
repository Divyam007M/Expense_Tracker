import React from 'react';

function ExpenseList() {
  return (
    <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
      </div>
      <div className="p-8 text-center bg-white min-h-[300px] flex flex-col justify-center items-center">
        
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p className="text-gray-500 font-medium">No expenses logged yet</p>
        <p className="text-gray-400 text-sm mt-1">Start adding expenses to see your list here.</p>

        {/* Placeholder styling to show layout intentions */}
        <div className="mt-8 w-full max-w-sm space-y-3 opacity-30 pointer-events-none hidden sm:block">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold shrink-0">L</div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Lunch</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
            <span className="font-semibold text-gray-900 text-sm">-$15.00</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ExpenseList;
