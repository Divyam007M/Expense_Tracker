import React, { useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ expenses }) {
  const { formatAmount } = useCurrency();
  const chartData = useMemo(() => {
    // Group expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#ef4444', // red-500
            '#3b82f6', // blue-500
            '#10b981', // emerald-500
            '#f59e0b', // amber-500
            '#8b5cf6', // violet-500
            '#ec4899', // pink-500
            '#06b6d4', // cyan-500
            '#84cc16'  // lime-500
          ],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 4
        },
      ],
    };
  }, [expenses]);

  if (!expenses || expenses.length === 0) {
    return null;
  }

  // Check if all amounts are 0 (which would cause a blank chart)
  const totalAmount = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
  
  if (totalAmount === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-xl p-6 border border-gray-100 flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 self-start">Expenses by Category</h2>
      <div className="w-full max-w-[280px]">
        <Pie 
          data={chartData} 
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed !== null) {
                      label += formatAmount(context.parsed);
                    }
                    return label;
                  }
                }
              }
            }
          }} 
        />
      </div>
    </div>
  );
}

export default ExpenseChart;
