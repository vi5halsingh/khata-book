import React, { useState } from 'react';

function TransactionFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
    sort: 'newest'
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: value
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    const defaultFilters = {
      type: '',
      startDate: '',
      endDate: '',
      sort: 'newest'
    };
    
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Transaction Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="bg-gray-900 p-2 rounded-md border border-gray-700 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">From Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="bg-gray-900 p-2 rounded-md border border-gray-700 focus:outline-none"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">To Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="bg-gray-900 p-2 rounded-md border border-gray-700 focus:outline-none"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Sort By</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="bg-gray-900 p-2 rounded-md border border-gray-700 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Amount (High to Low)</option>
            <option value="amount-low">Amount (Low to High)</option>
          </select>
        </div>
        
        <button
          onClick={resetFilters}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 mt-6"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default TransactionFilter;