import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserMinus, Users, Wallet } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const { members, addMember, removeMember } = useExpenses();
  const [newMember, setNewMember] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newMember.trim() && !members.find(m => m.name.toLowerCase() === newMember.toLowerCase())) {
      addMember(newMember.trim());
      setNewMember('');
    }
  };

  return (
    <aside className="w-72 hidden md:flex flex-col border-r border-white/10 glass-panel h-[calc(100vh-2rem)] m-4 rounded-3xl sticky top-4">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold flex items-center gap-3 tracking-tight text-white mb-2">
           <Wallet className="w-8 h-8 text-primary" />
           DivPay
        </h1>
        <p className="text-sm text-gray-400">Expense Splitting AI</p>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" /> Group Members ({members.length})
        </h2>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-4 custom-scrollbar">
          <AnimatePresence initial={false}>
            {members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors"
               >
                <div className="flex items-center gap-3 truncate">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-inner text-sm", member.color)}>
                     {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-200 truncate">{member.name}</span>
                </div>
                
                <button
                  onClick={() => removeMember(member.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                  title="Remove Member"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <form onSubmit={handleAddSubmit} className="mt-auto relative">
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Add new member..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all text-white placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={!newMember.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
