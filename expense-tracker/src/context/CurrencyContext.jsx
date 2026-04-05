import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const SUPPORTED_CURRENCIES = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  EUR: { symbol: '€', rate: 0.011 },
  GBP: { symbol: '£', rate: 0.0095 },
  JPY: { symbol: '¥', rate: 1.8 }
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const saved = localStorage.getItem('selectedCurrency');
    return saved && SUPPORTED_CURRENCIES[saved] ? saved : 'INR';
  });

  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  const currencySymbol = SUPPORTED_CURRENCIES[selectedCurrency].symbol;
  const currentRate = SUPPORTED_CURRENCIES[selectedCurrency].rate;
  const currencies = Object.keys(SUPPORTED_CURRENCIES);

  const formatAmount = (baseAmount) => {
    // Converts INR (base) to Selected Currency and formats string
    const converted = baseAmount * currentRate;
    return `${currencySymbol}${converted.toFixed(2)}`;
  };

  const convertToDisplay = (baseAmount) => {
    // Just converts the numeric value
    return baseAmount * currentRate;
  };

  const convertToBase = (displayAmount) => {
    // Converts Selected Currency to INR (base)
    return displayAmount / currentRate;
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        selectedCurrency, 
        setSelectedCurrency, 
        currencySymbol, 
        currencies,
        formatAmount,
        convertToDisplay,
        convertToBase
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
