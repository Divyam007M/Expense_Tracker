import { createContext, useState, useContext, useEffect } from 'react';

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [members, setMembers] = useState([
    { id: '1', name: 'Divyam', color: 'bg-emerald-500' },
  ]);

  const [expenses, setExpenses] = useState([
    { id: '1', description: 'Dinner', amount: 120, paidBy: '1', splitBetween: ['1'], category: 'Food', date: new Date().toISOString() },
  ]);

  const addMember = (name) => {
    const colors = ['bg-rose-500', 'bg-fuchsia-500', 'bg-violet-500', 'bg-cyan-500', 'bg-teal-500', 'bg-lime-500', 'bg-amber-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setMembers((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), name, color: randomColor }]);
  };

  const removeMember = (id) => {
    setMembers((prev) => prev.filter(m => m.id !== id));
    // Also remove them from splits
    setExpenses(prev => prev.map(exp => ({
      ...exp,
      splitBetween: exp.splitBetween.filter(mId => mId !== id)
    })));
  };

  const addExpense = (expense) => {
    setExpenses((prev) => [{ id: Math.random().toString(36).substr(2, 9), ...expense }, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter(e => e.id !== id));
  };

  const updateExpense = (id, newExpenseData) => {
    setExpenses((prev) => prev.map(e => e.id === id ? { ...e, ...newExpenseData } : e));
  };

  const getBalances = () => {
    const balances = {};
    members.forEach(m => balances[m.id] = 0);

    expenses.forEach(exp => {
      // Amount the payer paid
      if (balances[exp.paidBy] !== undefined) {
        balances[exp.paidBy] += exp.amount;
      }

      // Amount each person owes
      const splitAmount = exp.amount / Math.max(exp.splitBetween.length, 1);
      exp.splitBetween.forEach(mId => {
        if (balances[mId] !== undefined) {
          balances[mId] -= splitAmount;
        }
      });
    });

    return balances;
  };

  return (
    <ExpenseContext.Provider value={{
      members, expenses, addMember, removeMember, addExpense, deleteExpense, updateExpense, getBalances
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
