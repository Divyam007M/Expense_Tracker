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
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

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

  const formatOriginalAmount = (baseAmount, originalCurrency) => {
    const originalRate = SUPPORTED_CURRENCIES[originalCurrency]?.rate || 1;
    const originalSymbol = SUPPORTED_CURRENCIES[originalCurrency]?.symbol || '';
    const converted = baseAmount * originalRate;
    return `${originalSymbol}${converted.toFixed(2)}`;
  };

  const getRate = (currency) => SUPPORTED_CURRENCIES[currency]?.rate || 1;
  const getSymbol = (currency) => SUPPORTED_CURRENCIES[currency]?.symbol || '';

  return (
    <CurrencyContext.Provider 
      value={{ 
        selectedCurrency, 
        setSelectedCurrency, 
        currencySymbol, 
        currencies,
        formatAmount,
        convertToDisplay,
        convertToBase,
        formatOriginalAmount,
        getRate,
        getSymbol
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
