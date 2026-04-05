import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

function Header() {
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-blue-900">
          Expense Tracker
        </h1>
        <div className="flex items-center gap-2">
          <label htmlFor="currency-selector" className="text-sm font-medium text-gray-600 hidden sm:block">Currency:</label>
          <select 
            id="currency-selector"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="block rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm border bg-gray-50"
          >
            {currencies.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
