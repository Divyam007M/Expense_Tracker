import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

function ExpenseSummary({ expenses }) {
  const { formatAmount } = useCurrency();
  const total = (expenses || []).reduce((sum, expense) => sum + expense.amount, 0);

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? parseFloat(saved) : 0;
  });
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    const saved = localStorage.getItem('monthlyIncome');
    return saved ? parseFloat(saved) : 0;
  });
  const [incomeInput, setIncomeInput] = useState(monthlyIncome.toString());
  const [spendingRule, setSpendingRule] = useState(() => {
    const saved = localStorage.getItem('spendingRule');
    return saved ? parseInt(saved) : 100;
  });
  const [isEditingIncome, setIsEditingIncome] = useState(false);

  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem('monthlyIncome', monthlyIncome.toString());
  }, [monthlyIncome]);

  useEffect(() => {
    localStorage.setItem('spendingRule', spendingRule.toString());
  }, [spendingRule]);

  const currentMonthExpenses = (expenses || []).filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const handleSaveBudget = () => {
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setMonthlyBudget(newBudget);
    }
    setIsEditingBudget(false);
  };

  const handleSaveIncome = () => {
    const newIncome = parseFloat(incomeInput);
    if (!isNaN(newIncome) && newIncome >= 0) {
      setMonthlyIncome(newIncome);
    }
    setIsEditingIncome(false);
  };

  const allowedFromIncome = monthlyIncome > 0 ? monthlyIncome * (spendingRule / 100) : 0;
  
  let effectiveLimit = 0;
  if (monthlyBudget > 0 && allowedFromIncome > 0) {
    effectiveLimit = Math.min(monthlyBudget, allowedFromIncome);
  } else if (monthlyBudget > 0) {
    effectiveLimit = monthlyBudget;
  } else if (allowedFromIncome > 0) {
    effectiveLimit = allowedFromIncome;
  }

  const percentageUsed = effectiveLimit > 0 ? Math.min((currentMonthExpenses / effectiveLimit) * 100, 100) : 0;
  const remainingBudget = monthlyBudget > 0 ? monthlyBudget - currentMonthExpenses : 0;
  const isExceeded = effectiveLimit > 0 && currentMonthExpenses > effectiveLimit;
  const isNearing = effectiveLimit > 0 && currentMonthExpenses > effectiveLimit * 0.8 && !isExceeded;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg rounded-xl p-6 text-white border border-blue-500 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-medium text-blue-100 uppercase tracking-wider mb-2">Total Balance</h2>
        <div className="text-4xl font-extrabold tracking-tight">
          {formatAmount(total)}
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Monthly Budget</h3>
          {!isEditingBudget ? (
            <button onClick={() => setIsEditingBudget(true)} className="text-xs bg-white/20 hover:bg-white/30 transition-colors px-2 py-1 rounded text-white">
              Edit
            </button>
          ) : (
            <button onClick={handleSaveBudget} className="text-xs bg-green-500 hover:bg-green-600 transition-colors px-2 py-1 rounded text-white">
              Save Budget
            </button>
          )}
        </div>

        {isEditingBudget ? (
          <div className="mb-4 flex gap-2">
            <input 
              type="number" 
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="text-gray-900 px-2 py-1 rounded w-full text-sm"
              placeholder="Enter budget..."
              autoFocus
            />
          </div>
        ) : monthlyBudget > 0 ? (
          <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
            <div className="flex flex-col">
              <span className="text-blue-200 text-xs">Budget</span>
              <span className="font-semibold">{formatAmount(monthlyBudget)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-200 text-xs">Spent</span>
              <span className="font-semibold">{formatAmount(currentMonthExpenses)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-200 text-xs">Remaining</span>
              <span className={`font-semibold ${currentMonthExpenses > monthlyBudget ? 'text-red-300' : 'text-green-300'}`}>
                {formatAmount(remainingBudget)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-blue-200 mb-4">No budget set.</div>
        )}
      </div>

      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Monthly Income</h3>
          {!isEditingIncome ? (
            <button onClick={() => setIsEditingIncome(true)} className="text-xs bg-white/20 hover:bg-white/30 transition-colors px-2 py-1 rounded text-white">
              Edit
            </button>
          ) : (
            <button onClick={handleSaveIncome} className="text-xs bg-green-500 hover:bg-green-600 transition-colors px-2 py-1 rounded text-white">
              Save Income
            </button>
          )}
        </div>

        {isEditingIncome ? (
          <div className="mb-4 flex flex-col gap-3">
            <div>
              <label className="text-xs text-blue-200 mb-1 block">Monthly Income</label>
              <input 
                type="number" 
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                className="text-gray-900 px-2 py-1 rounded w-full text-sm"
                placeholder="Enter income..."
              />
            </div>
            <div>
              <label className="text-xs text-blue-200 mb-1 block">Spending Rule</label>
              <select 
                value={spendingRule}
                onChange={(e) => setSpendingRule(parseInt(e.target.value))}
                className="text-gray-900 px-2 py-1 rounded w-full text-sm"
              >
                <option value={100}>100% Spending Allowed</option>
                <option value={50}>50% Spending Rule</option>
              </select>
            </div>
          </div>
        ) : monthlyIncome > 0 ? (
          <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
            <div className="flex flex-col">
              <span className="text-blue-200 text-xs">Income</span>
              <span className="font-semibold">{formatAmount(monthlyIncome)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-200 text-xs">Allowed Limit</span>
              <span className="font-semibold">{formatAmount(allowedFromIncome)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-200 text-xs">Curr. Spend</span>
              <span className="font-semibold">{formatAmount(currentMonthExpenses)}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-blue-200 mb-4">No income set.</div>
        )}

        {effectiveLimit > 0 && !isEditingBudget && !isEditingIncome && (
          <div className="space-y-1 mt-2">
            <div className="w-full bg-blue-900/50 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${isExceeded ? 'bg-red-400' : isNearing ? 'bg-yellow-400' : 'bg-green-400'}`} 
                style={{ width: `${percentageUsed}%` }}
              ></div>
            </div>
            {isExceeded && <p className="text-xs text-red-300 font-medium mt-2">⚠️ You have exceeded your allowed spending limit!</p>}
            {isNearing && <p className="text-xs text-yellow-300 font-medium mt-2">⚠️ Warning: You are nearing your spending limit</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseSummary;
