import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseChart from './components/ExpenseChart';
import DateFilter from './components/DateFilter';
import EditExpenseModal from './components/EditExpenseModal';
import BudgetAdvisor from './components/BudgetAdvisor';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [filterType, setFilterType] = useState('all'); // 'all', 'month', 'custom'
  const [filterMonth, setFilterMonth] = useState(''); // 'YYYY-MM'
  const [filterStartDate, setFilterStartDate] = useState(''); // 'YYYY-MM-DD'
  const [filterEndDate, setFilterEndDate] = useState(''); // 'YYYY-MM-DD'
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (expense) => {
    const newExpense = { ...expense, id: uuidv4() };
    setExpenses([...expenses, newExpense]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleEditExpense = (updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
    setEditingExpense(null);
  };

  const handleClearFilter = () => {
    setFilterType('all');
    setFilterMonth('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  const handleExportCSV = () => {
    let csvContent = "Date,Description,Category,Amount\n";
    
    filteredExpenses.forEach(expense => {
      const note = expense.note || '';
      // Escape commas and existing double quotes by wrapping in quotes
      const escapedNote = note.replace(/"/g, '""');
      const formattedNote = escapedNote.includes(',') || escapedNote.includes('"') || escapedNote.includes('\n') 
        ? `"${escapedNote}"` 
        : escapedNote;
        
      const row = `${expense.date},${formattedNote},${expense.category},${expense.amount}`;
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `expenses_export_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      if (filterType === 'all') return true;
      
      if (filterType === 'month' && filterMonth) {
        // expense.date is in format YYYY-MM-DD. We can just use startsWith.
        return expense.date.startsWith(filterMonth);
      }
      
      if (filterType === 'custom') {
        if (filterStartDate && expense.date < filterStartDate) return false;
        if (filterEndDate && expense.date > filterEndDate) return false;
        return true;
      }
      
      return true;
    });
  }, [expenses, filterType, filterMonth, filterStartDate, filterEndDate]);

  return (
    <div className="min-h-screen pb-10">
      <Header />
      <main className="max-w-5xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <ExpenseSummary expenses={filteredExpenses} />
          <ExpenseForm onAddExpense={handleAddExpense} />
          <ExpenseChart expenses={filteredExpenses} />
        </div>
        <div className="md:col-span-2 flex flex-col gap-6">
          <DateFilter 
            filterType={filterType}
            setFilterType={setFilterType}
            month={filterMonth}
            setMonth={setFilterMonth}
            startDate={filterStartDate}
            setStartDate={setFilterStartDate}
            endDate={filterEndDate}
            setEndDate={setFilterEndDate}
            onClear={handleClearFilter}
            onExport={handleExportCSV}
          />
          <ExpenseList 
            expenses={filteredExpenses} 
            onDeleteExpense={handleDeleteExpense} 
            onEditExpense={(expense) => setEditingExpense(expense)}
          />
          <BudgetAdvisor expenses={filteredExpenses} />
        </div>
      </main>
      
      {editingExpense && (
        <EditExpenseModal 
          expense={editingExpense}
          onSave={handleEditExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}

export default App;
