import { Toaster } from 'react-hot-toast';
import { ExpenseProvider } from './context/ExpenseContext';
import { Sidebar } from './components/layout/Sidebar';
import { AIInputBox } from './components/expenses/AIInputBox';
import { BalanceCards } from './components/expenses/BalanceCards';
import { ExpenseTable } from './components/expenses/ExpenseTable';
import { ExpenseChart } from './components/dashboard/ExpenseChart';

function AppContent() {
  return (
    <div className="flex min-h-screen relative">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 max-h-screen overflow-y-auto custom-scrollbar relative z-10 w-full">
        <div className="max-w-6xl mx-auto w-full pt-4 pb-12">
           <header className="mb-10 block md:hidden">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2 pb-0 pt-2">
                 DivPay
              </h1>
              <p className="text-sm text-gray-400">Expense Splitting AI</p>
           </header>

           <AIInputBox />
           <BalanceCards />
           
           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                 <ExpenseTable />
              </div>
              <div>
                 <ExpenseChart />
              </div>
           </div>
        </div>
      </main>

      {/* Decorative blurred background shapes */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-500/10 blur-[120px] pointer-events-none z-0"></div>
    </div>
  );
}

function App() {
  return (
    <ExpenseProvider>
      <AppContent />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 17, 21, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } }
        }}
      />
    </ExpenseProvider>
  );
}

export default App;
