import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useExpenses } from '../../context/ExpenseContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export function ExpenseChart() {
  const { expenses } = useExpenses();

  const data = useMemo(() => {
    const categories = {};
    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      if (!categories[cat]) categories[cat] = 0;
      categories[cat] += exp.amount;
    });

    return Object.keys(categories)
      .map(key => ({
        name: key,
        value: categories[key]
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  if (expenses.length === 0) return null;

  return (
    <div className="glass-panel p-6 border-white/5 h-96 flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">Expenses by Category</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
            >
              {data.map((entry, index) => (
                <Cell 
                   key={`cell-${index}`} 
                   fill={COLORS[index % COLORS.length]} 
                   className="filter drop-shadow-md hover:opacity-80 transition-opacity cursor-pointer duration-200"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 17, 21, 0.95)', 
                backdropFilter: 'blur(8px)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => `$${value.toFixed(2)}`}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
