import { useState } from 'react';
import { motion } from 'framer-motion';
import { useExpenses } from '../../context/ExpenseContext';
import toast from 'react-hot-toast';

export function AIInputBox() {
  const [who, setWho] = useState('');
  const [what, setWhat] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { addExpense, members } = useExpenses();

  // 🔥 Common validation
  const validate = () => {
    if (!who || !what || !amount) {
      toast.error("Fill all fields");
      return null;
    }

    const member = members.find(
      m => m.name.toLowerCase() === who.toLowerCase()
    );

    if (!member) {
      toast.error("Member not found");
      return null;
    }

    return member;
  };

  // ✅ Add-on (manual selection)
  const handleAddOn = () => {
    const member = validate();
    if (!member) return;

    if (selectedMembers.length === 0) {
      return toast.error("Select at least one member");
    }

    addExpense({
      description: what,
      amount: parseFloat(amount),
      paidBy: member.id,
      splitBetween: selectedMembers,
      category: 'Manual',
      date: new Date().toISOString()
    });

    toast.success("Expense added (custom split) ✅");

    resetForm();
  };

  // ✅ Split between all
  const handleSplitAll = () => {
    const member = validate();
    if (!member) return;

    addExpense({
      description: what,
      amount: parseFloat(amount),
      paidBy: member.id,
      splitBetween: members.map(m => m.id),
      category: 'Manual',
      date: new Date().toISOString()
    });

    toast.success("Expense split between all ✅");

    resetForm();
  };

  const resetForm = () => {
    setWho('');
    setWhat('');
    setAmount('');
    setSelectedMembers([]);
  };

  const isDisabled = !who || !what || !amount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl w-full mt-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Log a Shared Expense
          </h2>
          <p className="text-sm text-gray-400">
            Add and split expenses with your group
          </p>
        </div>

        <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">
          Manual
        </div>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-3 gap-4">
        <input
          value={who}
          onChange={(e) => setWho(e.target.value)}
          placeholder="Who paid?"
          className="bg-[#1a2035] p-3 rounded-lg text-white outline-none 
                     focus:ring-2 focus:ring-primary"
        />

        <input
          value={what}
          onChange={(e) => setWhat(e.target.value)}
          placeholder="What was it for?"
          className="bg-[#1a2035] p-3 rounded-lg text-white outline-none 
                     focus:ring-2 focus:ring-primary"
        />

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="₹ 0.00"
          className="bg-[#1a2035] p-3 rounded-lg text-white outline-none 
                     focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* 👥 Select Members (Add-on feature) */}
      <div className="mt-5">
        <p className="text-sm text-gray-400 mb-2">
          Select members (for Add-on split):
        </p>

        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMembers(prev =>
                  prev.includes(m.id)
                    ? prev.filter(id => id !== m.id)
                    : [...prev, m.id]
                );
              }}
              className={`px-3 py-1 rounded-full text-sm border transition
                ${selectedMembers.includes(m.id)
                  ? 'bg-primary text-white border-primary'
                  : 'border-white/20 text-gray-300 hover:bg-white/10'}
              `}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6 flex-wrap gap-3">
        <button
          onClick={handleAddOn}
          className="px-4 py-2 border border-white/20 rounded-lg text-white 
                     hover:bg-white/10 transition"
        >
          + Add on
        </button>

        <button
          onClick={handleSplitAll}
          disabled={isDisabled}
          className={`px-6 py-2 rounded-lg text-white transition shadow-lg
            ${isDisabled
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-primary hover:opacity-90'}
          `}
        >
          Split between all
        </button>
      </div>
    </motion.div>
  );
}