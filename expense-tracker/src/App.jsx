import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseChart from './components/ExpenseChart';
import DateFilter from './components/DateFilter';
import EditExpenseModal from './components/EditExpenseModal';
import BudgetAdvisor from './components/BudgetAdvisor';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import { useAuth } from './context/AuthContext';
import { useCurrency } from './context/CurrencyContext';
import { supabase } from './lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const { user, loading: authLoading, setShowAuthModal } = useAuth();
  const { setSelectedCurrency } = useCurrency();
  
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('guest_expenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Deriving and setting dominant currency dynamically
  const dominantCurrency = useMemo(() => {
    if (!expenses || expenses.length === 0) return 'INR';
    const counts = {};
    let maxCount = 0;
    let maxCurr = 'INR';
    expenses.forEach(e => {
      const cur = e.currency || 'INR';
      counts[cur] = (counts[cur] || 0) + 1;
      if (counts[cur] > maxCount) {
        maxCount = counts[cur];
        maxCurr = cur;
      }
    });
    return maxCurr;
  }, [expenses]);

  useEffect(() => {
    setSelectedCurrency(dominantCurrency);
  }, [dominantCurrency, setSelectedCurrency]);

  const [filterType, setFilterType] = useState('all');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);

  // Sync Guest Data to Supabase on Login
  useEffect(() => {
    const syncAndFetchData = async () => {
      if (authLoading) return;

      if (user) {
        setLoadingExpenses(true);
        try {
          // Check for local guest data to sync
          const localData = localStorage.getItem('guest_expenses');
          if (localData) {
            const guestExpenses = JSON.parse(localData);
            if (guestExpenses.length > 0) {
              setIsSyncing(true);
              const { error } = await supabase.from('expenses').insert(
                guestExpenses.map(exp => ({
                  amount: exp.amount,
                  category: exp.category,
                  date: exp.date,
                  currency: exp.currency,
                  description: exp.note,
                  user_id: user.id
                }))
              );
              if (error) throw error;
              toast.success("Guest data synced to your account successfully!");
            }
            // Clear local storage after syncing
            localStorage.removeItem('guest_expenses');
            setIsSyncing(false);
          }

          // Fetch fresh user data
          const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

          if (error) throw error;
          
          const mappedData = (data || []).map(exp => ({
            ...exp,
            note: exp.description
          }));
          setExpenses(mappedData);
        } catch (error) {
          console.error("Error fetching/syncing expenses:", error);
          toast.error("Failed to load or sync your data.");
          setIsSyncing(false);
        } finally {
          setLoadingExpenses(false);
        }
      } else {
        // If not logged in, ensure we're serving whatever is in local storage
        const saved = localStorage.getItem('guest_expenses');
        setExpenses(saved ? JSON.parse(saved) : []);
      }
    };

    syncAndFetchData();
  }, [user, authLoading]);

  // Persist guest data locally whenever it changes (if not logged in)
  useEffect(() => {
    if (!user && !authLoading) {
      localStorage.setItem('guest_expenses', JSON.stringify(expenses));
    }
  }, [expenses, user, authLoading]);

  const handleAddExpense = async (expense) => {
    if (!user) {
      // Guest Mode Logic
      const newExpense = { ...expense, id: uuidv4() };
      setExpenses(prev => [newExpense, ...prev]);
      toast('Expense added locally', { icon: '⚠️' });
      toast('Login to save your data permanently', {
        icon: '🔒',
        duration: 4000,
      });
      return;
    }

    // Authenticated Logic
    try {
      const newExpenseData = { 
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        currency: expense.currency,
        description: expense.note,
        user_id: user.id 
      };
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpenseData])
        .select()
        .single();
        
      if (error) throw error;
      setExpenses(prev => [{ ...data, note: data.description }, ...prev]);
      toast.success("Expense saved safely!");
    } catch (err) {
      console.error("Error adding expense", err);
      toast.error("Failed to save expense.");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!user) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast.success("Expense deleted locally.");
      return;
    }

    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast.success("Expense deleted.");
    } catch (err) {
      console.error("Error deleting expense", err);
      toast.error("Failed to delete expense.");
    }
  };

  const handleEditExpense = async (updatedExpense) => {
    if (!user) {
      setExpenses(prev => prev.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      ));
      setEditingExpense(null);
      toast.success("Expense updated locally.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          amount: updatedExpense.amount,
          category: updatedExpense.category,
          date: updatedExpense.date,
          description: updatedExpense.note,
          currency: updatedExpense.currency
        })
        .eq('id', updatedExpense.id)
        .select()
        .single();
        
      if (error) throw error;

      setExpenses(prev => prev.map(expense => 
        expense.id === data.id ? { ...data, note: data.description } : expense
      ));
      setEditingExpense(null);
      toast.success("Expense updated.");
    } catch (err) {
      console.error("Error updating expense", err);
      toast.error("Failed to update expense.");
    }
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

  if (authLoading || loadingExpenses || isSyncing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 font-medium tracking-wide">
          {isSyncing ? 'Syncing your data to the cloud...' : 'Loading your dashboard...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10 bg-gray-50 relative">
      <Toaster position="top-right" />
      <AuthModal />
      <ProfileModal />
      
      {/* Guest Mode Banner */}
      {!user && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-white text-sm font-medium text-center shadow-sm relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-all">
          <span>You are currently in Guest Mode. Your data isn't saved securely!</span>
          <button 
            onClick={() => setShowAuthModal('login')}
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-1 px-3 rounded-md transition-colors border border-white/20"
          >
            Login or Signup to sync
          </button>
        </div>
      )}

      <Header />
      
      <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
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
