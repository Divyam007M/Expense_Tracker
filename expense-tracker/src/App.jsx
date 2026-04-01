import React from 'react';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';

function App() {
  return (
    <div className="min-h-screen pb-10">
      <Header />
      <main className="max-w-5xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <ExpenseSummary />
          <ExpenseForm />
        </div>
        <div className="md:col-span-2">
          <ExpenseList />
        </div>
      </main>
    </div>
  );
}

export default App;
