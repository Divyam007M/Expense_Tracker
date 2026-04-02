import React from 'react';

function DateFilter({
  filterType,
  setFilterType,
  month,
  setMonth,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClear,
  onExport
}) {
  return (
    <div className="bg-white shadow rounded-xl p-6 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      <div className="flex items-center gap-3">
        <label htmlFor="filterType" className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Date Filter:
        </label>
        <select
          id="filterType"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="block w-full sm:w-auto rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white border shadow-sm"
        >
          <option value="all">All Time</option>
          <option value="month">By Month</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      <div className="flex items-center gap-3 flex-wrap flex-grow md:justify-end w-full">
        {filterType === 'month' && (
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="block w-full sm:w-auto rounded-md border-gray-300 py-2 sm:py-1.5 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white border shadow-sm"
          />
        )}

        {filterType === 'custom' && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-500 w-10 sm:w-auto">Start</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full sm:w-auto rounded-md border-gray-300 py-2 sm:py-1.5 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white border shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-500 w-10 sm:w-auto">End</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full sm:w-auto rounded-md border-gray-300 py-2 sm:py-1.5 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white border shadow-sm"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2 sm:mt-0 md:ml-auto">
          {filterType !== 'all' && (
            <button
              onClick={onClear}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-md hover:bg-red-50 transition-colors w-full sm:w-auto text-center"
            >
              Clear Filter
            </button>
          )}
          <button
            onClick={onExport}
            className={`flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-md hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm w-full sm:w-auto ${filterType === 'all' ? 'md:ml-auto' : ''}`}
            title="Export visible rows as CSV"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default DateFilter;
