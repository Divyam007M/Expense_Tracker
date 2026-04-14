import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

function Header() {
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();
  const { user, setShowAuthModal } = useAuth();

  return (
    <header className="bg-white shadow relative z-20">
      <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center">
        
        {/* Left: Auth Controls */}
        <div className="flex items-center justify-start">
          {!user ? (
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAuthModal('login')}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg"
              >
                Log In
              </button>
              <button 
                onClick={() => setShowAuthModal('signup')}
                className="text-sm font-semibold text-white transition-colors bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <ProfileDropdown />
          )}
        </div>

        {/* Center: Title */}
        <div className="flex justify-center text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-900 drop-shadow-sm">
            Expense Tracker
          </h1>
        </div>

        {/* Right: Currency Removed */}
        <div className="flex items-center justify-end gap-2 text-sm font-medium text-indigo-600 hidden sm:block">
          {/* We can leave this empty or place something here later if needed */}
        </div>

      </div>
    </header>
  );
}

export default Header;
