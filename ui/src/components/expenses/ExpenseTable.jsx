import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Calendar } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { cn } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import toast from 'react-hot-toast';

export function ExpenseTable() {
  const { expenses, deleteExpense, members } = useExpenses();
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, payload: null });

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const executeDelete = () => {
    if (modalState.type === 'bulk') {
      selectedIds.forEach(id => deleteExpense(id));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} expenses deleted`);
    } else if (modalState.type === 'single') {
      deleteExpense(modalState.payload);
      toast.success('Expense deleted');
    }
    setModalState({ isOpen: false, type: null, payload: null });
  };

  const getMemberName = (id) => members.find(m => m.id === id)?.name || 'Unknown';

  return (
    <>
      <div className="glass-panel overflow-hidden border border-white/5">
      <div className="flex justify-between items-center p-6 border-b border-white/5">
         <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
         
         <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setModalState({ isOpen: true, type: 'bulk', payload: null })}
                className="glass-button-danger py-1.5 text-sm"
              >
                <Trash2 className="w-4 h-4" /> Delete ({selectedIds.length})
              </motion.button>
            )}
         </AnimatePresence>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-sm">
              <th className="p-4 font-medium w-12">
                <input 
                  type="checkbox" 
                  className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50 accent-primary"
                  onChange={(e) => setSelectedIds(e.target.checked ? expenses.map(e => e.id) : [])}
                  checked={expenses.length > 0 && selectedIds.length === expenses.length}
                />
              </th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium hidden sm:table-cell">Paid By</th>
              <th className="p-4 font-medium text-right">Amount</th>
              <th className="p-4 font-medium w-16 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {expenses.length === 0 ? (
                <tr>
                   <td colSpan="5" className="p-8 text-center text-gray-500 italic">No expenses recorded yet. Use the AI input above to start tracking!</td>
                </tr>
              ) : expenses.map((expense) => (
                <motion.tr 
                  key={expense.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                     "border-b border-white/5 hover:bg-white/[0.02] transition-colors group",
                     selectedIds.includes(expense.id) && "bg-primary/5 hover:bg-primary/10"
                  )}
                >
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50 accent-primary opacity-50 group-hover:opacity-100 transition-opacity"
                      checked={selectedIds.includes(expense.id)}
                      onChange={() => toggleSelect(expense.id)}
                    />
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-medium text-gray-200">{expense.description}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                     <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                        {getMemberName(expense.paidBy)}
                     </span>
                  </td>
                  <td className="p-4 text-right font-bold text-white tracking-tight">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                       onClick={() => setModalState({ isOpen: true, type: 'single', payload: expense.id })}
                       className="p-2 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      </div>

      <Modal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ isOpen: false, type: null, payload: null })}
        title="Confirm Deletion"
      >
        <div className="space-y-6">
           <p className="text-gray-300">
             Are you sure you want to delete {modalState.type === 'bulk' ? `these ${selectedIds.length} expenses` : 'this expense'}? This action cannot be undone.
           </p>
           <div className="flex justify-end gap-3">
             <button onClick={() => setModalState({ isOpen: false, type: null, payload: null })} className="glass-button-secondary py-2 px-4">Cancel</button>
             <button onClick={executeDelete} className="glass-button-danger py-2 px-4">Delete</button>
           </div>
        </div>
      </Modal>
    </>
  );
}
