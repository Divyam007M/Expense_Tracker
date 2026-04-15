import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

function ExpenseSummary({ expenses }) {
  const { formatAmount, currencySymbol } = useCurrency();
  const { user, setShowAuthModal } = useAuth();
  // Guard each expense.amount against NaN/null before summing
  // totalSpent = sum of all expenses passed in (already filtered by App.jsx's date/month filter)
  const totalSpent = (expenses || []).reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState('0');
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [incomeInput, setIncomeInput] = useState('0');
  const [spendingRule, setSpendingRule] = useState(100);
  const [isEditingIncome, setIsEditingIncome] = useState(false);

  const [loadingInitial, setLoadingInitial] = useState(false);

  // Fetch initial budget and income from Supabase
  useEffect(() => {
    const fetchFinancialData = async () => {
      if (!user) {
        // Not authenticated — no fetch needed, ensure spinner is off
        setLoadingInitial(false);
        return;
      }

      try {
        setLoadingInitial(true);
        // Fetch budget
        const { data: budgetData } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (budgetData) {
          setMonthlyBudget(parseFloat(budgetData.monthly_limit));
          setBudgetInput(budgetData.monthly_limit.toString());
        }

        // Fetch income
        const { data: incomeData } = await supabase
          .from('income')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (incomeData) {
          setMonthlyIncome(parseFloat(incomeData.amount));
          setIncomeInput(incomeData.amount.toString());
          setSpendingRule(incomeData.spending_rule || 100);
        }
      } catch (err) {
        console.error("Error fetching financial data from Supabase:", err);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchFinancialData();
  }, [user]);

  // No need to re-filter here — expenses prop is already filtered by App.jsx's date/month filter.

  const handleSaveBudget = async () => {
    if (!user) {
      toast('Login to save your budget permanently', { icon: '🔒' });
      setShowAuthModal(true);
      return;
    }
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setMonthlyBudget(newBudget);
      setIsEditingBudget(false);

      const { error } = await supabase
        .from('budgets')
        .insert([{ user_id: user.id, monthly_limit: newBudget }]);

      if (error) console.error("Error saving budget:", error);
      else toast.success("Budget saved securely!");
    }
  };

  const handleSaveIncome = async () => {
    if (!user) {
      toast('Login to save your income permanently', { icon: '🔒' });
      setShowAuthModal(true);
      return;
    }
    const newIncome = parseFloat(incomeInput);
    if (!isNaN(newIncome) && newIncome >= 0) {
      setMonthlyIncome(newIncome);
      setIsEditingIncome(false);

      const { error } = await supabase
        .from('income')
        .insert([{ user_id: user.id, amount: newIncome, spending_rule: spendingRule }]);

      if (error) console.error("Error saving income:", error);
      else toast.success("Income details saved securely!");
    }
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

  const percentageUsed = effectiveLimit > 0 ? Math.min((totalSpent / effectiveLimit) * 100, 100) : 0;
  const remainingBudget = monthlyBudget > 0 ? monthlyBudget - totalSpent : 0;
  const isExceeded = effectiveLimit > 0 && totalSpent > effectiveLimit;
  const isNearing = effectiveLimit > 0 && totalSpent > effectiveLimit * 0.8 && !isExceeded;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg rounded-xl p-6 text-white border border-blue-500 flex flex-col gap-5 relative">
      {/* Show spinner only when authenticated AND data is still loading */}
      {user && loadingInitial && (
        <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-blue-100 uppercase tracking-wider mb-2">Total Spent</h2>
        <div className="text-4xl font-extrabold tracking-tight">
          {formatAmount(totalSpent)}
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Monthly Budget</h3>
          {!isEditingBudget ? (
            <button onClick={() => setIsEditingBudget(true)} className="text-xs bg-white/20 hover:bg-white/30 transition-colors px-2 py-1 rounded text-white cursor-pointer relative z-20">
              Edit
            </button>
          ) : (
            <button onClick={handleSaveBudget} className="text-xs bg-green-500 hover:bg-green-600 transition-colors px-2 py-1 rounded text-white cursor-pointer relative z-20">
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
              <span className="font-semibold">{formatAmount(totalSpent)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-200 text-xs">Remaining</span>
              <span className={`font-semibold ${totalSpent > monthlyBudget ? 'text-red-300' : 'text-green-300'}`}>
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
            <button onClick={() => setIsEditingIncome(true)} className="text-xs bg-white/20 hover:bg-white/30 transition-colors px-2 py-1 rounded text-white cursor-pointer relative z-20">
              Edit
            </button>
          ) : (
            <button onClick={handleSaveIncome} className="text-xs bg-green-500 hover:bg-green-600 transition-colors px-2 py-1 rounded text-white cursor-pointer relative z-20">
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
              <span className="text-blue-200 text-xs">Curr. Spent</span>
              <span className="font-semibold">{formatAmount(totalSpent)}</span>
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
