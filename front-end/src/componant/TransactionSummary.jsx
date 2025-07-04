import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {toast , Toaster}  from 'react-hot-toast';

function TransactionSummary({transactionChanged}) {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Fetch transaction summary from API
  const fetchSummary = async () => {
    try {
      setLoading(true);
      
      // Build query string for date filtering
      let queryParams = '';
      if (dateRange.startDate) {
        queryParams += `startDate=${dateRange.startDate}`;
      }
      if (dateRange.endDate) {
        queryParams += queryParams ? `&endDate=${dateRange.endDate}` : `endDate=${dateRange.endDate}`;
      }
      
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/transactions/summary${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSummary(data.data);
      } else {
        const message = 'you may not be logged in'    
         toast.error(message);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };
  
  // Load summary when component mounts or date range changes
  useEffect(() => {
    fetchSummary();
  }, [dateRange.startDate, dateRange.endDate, typeof transactionChanged !== 'undefined' ? transactionChanged : null]);
 
  // Handle date range changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-900 text-white p-5 rounded-lg shadow-lg border border-gray-700 mb-6 ">

{/* <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#1a1b29',
          color: '#fff',
          border: '1px solid #4caf50'
        }
      }}
    /> */}
      <h2 className="text-xl font-bold mb-4">Financial Summary</h2>
      
      {/* Date filter controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex flex-col ">
          <label className="text-sm text-gray-400 mb-1">From</label>
          <input 
            type="date" 
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className="bg-gray-800 p-2 rounded-md border border-gray-700 focus:outline-none"
          />
        </div>
        <div className="flex flex-col ">
          <label className="text-sm text-gray-400 mb-1">To</label>
          <input 
            type="date" 
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            className="bg-gray-800 p-2 rounded-md border border-gray-700 focus:outline-none"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center p-3">Searching your summary...</div>
      ) : error ? (
        <div className="text-center p-3 text-red-500">{error}</div>
      ) : (
        <div className="md:grid grid-cols-3 gap-4 ">
          <div className="bg-green-900 p-4 rounded-lg text-center mt-2 overflow-hidden">
            <h3 className="text-sm text-gray-300 mb-1">Income</h3>
            <p className="text-2xl font-bold text-green-400 ">₹ {summary.income.toLocaleString()}</p>
          </div>
          <div className="bg-red-900 p-4 rounded-lg text-center  mt-2 overflow-hidden">
            <h3 className="text-sm text-gray-300 mb-1">Expense</h3>
            <p className="text-2xl font-bold text-red-400">₹ {summary.expense.toLocaleString()}</p>
          </div>
          <div className="bg-blue-900 p-4 rounded-lg text-center  mt-2 overflow-hidden">
            <h3 className="text-sm text-gray-300 mb-1">Balance</h3>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₹ {summary.balance.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    
    </div>
  );
}

export default TransactionSummary;