import React, { useState, useMemo } from 'react';

function BudgetAdvisor({ expenses }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [advice, setAdvice] = useState(null);

  const categoryTotals = useMemo(() => {
    return (expenses || []).reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
  }, [expenses]);

  const generateInsights = async () => {
    if (Object.keys(categoryTotals).length === 0) {
      setError("Add some expenses first to get AI insights!");
      return;
    }

    setLoading(true);
    setError(null);
    setAdvice(null);

    try {
      // Logic for the real API call would go here.
      // We are mocking a 1.2s network delay and a structured AI JSON response.
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Calculate total for percentages
      const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
      const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
      const [topCategory, topAmount] = sorted[0];
      const topPercentage = ((topAmount / total) * 100).toFixed(1);

      // Simple heuristic for mock insights
      let mockAdvice;
      if (topCategory === 'Food & Drink' && topPercentage > 30) {
        mockAdvice = {
          highlight: `Dining at ${topPercentage}% of your budget is your biggest trend.`,
          warning: "Your food and drink spending is significantly higher than average benchmarks.",
          actionable_advice: [
            "Consider a 'No-Order Week' to reduce dining out costs.",
            "Try prepping bulk meals for work lunches to save on snacks.",
            "Compare grocery prices at nearby local markets instead of boutique stores."
          ]
        };
      } else if (topPercentage > 50) {
        mockAdvice = {
          highlight: `${topCategory} accounts for over half of your core spending.`,
          warning: `Relying on a single category for ${topPercentage}% of your budget can be Risky.`,
          actionable_advice: [
            "Review if this high spending is a one-time necessity or a recurring leak.",
            "Look for alternative service providers to lower monthly fixed costs.",
            "Set a hard cap for this specific category next month."
          ]
        };
      } else {
        mockAdvice = {
          highlight: `Your spending is relatively diversified, with ${topCategory} as the leader.`,
          warning: "No critical red flags detected, but you're still outflowing substantial funds.",
          actionable_advice: [
            "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
            "Consolidate your smaller 'Other' expenses into tracked categories.",
            "Review your subscriptions to see what you haven't used in 30 days."
          ]
        };
      }

      setAdvice(mockAdvice);
    } catch (err) {
      setError("Failed to reach the AI Advisor. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 border border-gray-100 dark:border-gray-700 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">AI Budget Advisor</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get personalized spending tips</p>
          </div>
        </div>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </>
          ) : (
            "Generate Insights"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg text-sm border border-red-100 dark:border-red-800 italic">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      )}

      {advice && (
        <div className="bg-gradient-to-br from-indigo-50/50 dark:from-indigo-900/20 to-white dark:to-gray-800/50 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">Highlight</span>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              {advice.highlight}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600">Risk Assessment</span>
            <p className="text-sm text-amber-800 dark:text-amber-200 bg-amber-50/50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800 italic">
              {advice.warning}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">Actionable Advice</span>
            <ul className="space-y-2">
              {advice.actionable_advice.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetAdvisor;
