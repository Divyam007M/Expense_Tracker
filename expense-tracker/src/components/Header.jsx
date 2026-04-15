import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ProfileDropdown from './ProfileDropdown';

function Header() {
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();
  const { user, setShowAuthModal } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 relative z-20 border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* Left: Auth Controls */}
        <div className="flex items-center justify-start min-w-0">
          {!user ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowAuthModal('login')}
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-4 py-2 rounded-lg"
              >
                Log In
              </button>
              <button
                onClick={() => setShowAuthModal('signup')}
                className="text-sm font-semibold text-white transition-colors bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-4 py-2 rounded-lg shadow-sm"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <ProfileDropdown />
          )}
        </div>

        {/* Center: Title */}
        <div className="flex-1 flex justify-center text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-900 dark:text-blue-300 drop-shadow-sm whitespace-nowrap">
            Expense Tracker
          </h1>
        </div>

        {/* Right: Dark Mode Toggle */}
        <div className="flex items-center justify-end">
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="relative inline-flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                : 'linear-gradient(135deg, #f59e0b, #fb923c)',
            }}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {/* Track pill */}
            <span className="sr-only">{isDark ? 'Dark' : 'Light'} mode</span>

            {/* Sliding knob */}
            <span
              className={`absolute left-1 w-5 h-5 rounded-full shadow-md flex items-center justify-center text-[11px] transition-transform duration-300 ${
                isDark ? 'translate-x-5 bg-gray-900' : 'translate-x-0 bg-white'
              }`}
            >
              {isDark ? '🌙' : '☀️'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;
