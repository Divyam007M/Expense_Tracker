import { useExpenses } from '../../context/ExpenseContext';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';

const formatCurrency = (amt) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);

export function BalanceCards() {
   const { members, getBalances } = useExpenses();
   const balances = getBalances();

   const formattedBalances = members.map(m => ({
      ...m,
      balance: balances[m.id] || 0
   })).sort((a, b) => b.balance - a.balance);

   const totalExpenses = Object.values(balances).reduce((sum, val) => val > 0 ? sum + val : sum, 0);

   return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         {/* Total Card */}
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 bg-gradient-to-br from-primary/20 to-transparent border-primary/20 relative overflow-hidden group"
         >
            <div className="absolute top-0 right-0 p-4 opacity-50 text-primary">
               <DollarSign className="w-24 h-24 -mt-6 -mr-6 opacity-20" />
            </div>
            <h3 className="text-gray-400 font-medium mb-1">Total Group Expense</h3>
            <p className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalExpenses)}</p>
         </motion.div>

         {/* Top Creditor */}
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 border-success/20 bg-gradient-to-br from-success/10 to-transparent"
         >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-gray-400 font-medium mb-1 flex items-center gap-2">
                     <TrendingUp className="w-4 h-4 text-success" />
                     Who Gets Back
                  </h3>
               </div>
            </div>

            <div className="space-y-3">
               {formattedBalances.filter(m => m.balance > 0).slice(0, 2).map(m => (
                  <div key={m.id} className="flex justify-between items-center text-sm">
                     <div className="flex items-center gap-2 font-medium text-white">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs", m.color)}>
                           {m.name.charAt(0)}
                        </div>
                        {m.name}
                     </div>
                     <span className="text-success font-semibold">+{formatCurrency(m.balance)}</span>
                  </div>
               ))}
               {formattedBalances.filter(m => m.balance > 0).length === 0 && (
                  <p className="text-gray-500 text-sm italic">All settled up!</p>
               )}
            </div>
         </motion.div>

         {/* Top Debtor */}
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 border-danger/20 bg-gradient-to-br from-danger/10 to-transparent"
         >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-gray-400 font-medium mb-1 flex items-center gap-2">
                     <TrendingDown className="w-4 h-4 text-danger" />
                     Who Owes
                  </h3>
               </div>
            </div>

            <div className="space-y-3">
               {formattedBalances.filter(m => m.balance < 0).reverse().slice(0, 2).map(m => (
                  <div key={m.id} className="flex justify-between items-center text-sm">
                     <div className="flex items-center gap-2 font-medium text-white">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs", m.color)}>
                           {m.name.charAt(0)}
                        </div>
                        {m.name}
                     </div>
                     <span className="text-danger font-semibold">{formatCurrency(Math.abs(m.balance))}</span>
                  </div>
               ))}
               {formattedBalances.filter(m => m.balance < 0).length === 0 && (
                  <p className="text-gray-500 text-sm italic">All settled up!</p>
               )}
            </div>
         </motion.div>
      </div>
   );
}
