import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';

function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions/summary`, {
        method: 'GET',
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // This fetches only authenticated user's data (backend filters by user ID from JWT)
        setSummary({
          totalIncome: data.data?.totalIncome || 0,
          totalExpense: data.data?.totalExpense || 0,
          balance: (data.data?.totalIncome || 0) - (data.data?.totalExpense || 0)
        });
      } else {
        setError(data.msg || 'Failed to load summary');
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError('Failed to connect to server');
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          autoClose: 2000,
          style: {
            background: '#1a1b29',
            color: '#fff',
            border: '1px solid #4caf50'
          }
        }}
      />
      <div className="text-white p-6 w-full min-h-screen">
        <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading your dashboard data...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Income Card */}
            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 shadow-lg border border-green-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Income</h3>
                <FiTrendingUp className="text-3xl text-green-400" />
              </div>
              <p className="text-4xl font-bold text-green-300 mb-2">
                Rs. {summary.totalIncome.toFixed(2)}
              </p>
              <p className="text-sm text-green-200">Your total income</p>
            </div>

            {/* Total Expense Card */}
            <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg p-6 shadow-lg border border-red-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Expense</h3>
                <FiTrendingDown className="text-3xl text-red-400" />
              </div>
              <p className="text-4xl font-bold text-red-300 mb-2">
                Rs. {summary.totalExpense.toFixed(2)}
              </p>
              <p className="text-sm text-red-200">Your total expenses</p>
            </div>

            {/* Balance Card */}
            <div className={`bg-gradient-to-br ${summary.balance >= 0 ? 'from-blue-900 to-blue-800' : 'from-orange-900 to-orange-800'} rounded-lg p-6 shadow-lg ${summary.balance >= 0 ? 'border border-blue-700' : 'border border-orange-700'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Net Balance</h3>
                <FiDollarSign className={`text-3xl ${summary.balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
              </div>
              <p className={`text-4xl font-bold mb-2 ${summary.balance >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>
                Rs. {summary.balance.toFixed(2)}
              </p>
              <p className={`text-sm ${summary.balance >= 0 ? 'text-blue-200' : 'text-orange-200'}`}>
                {summary.balance >= 0 ? 'Positive balance' : 'Negative balance'}
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats Section */}
        {!loading && !error && (
          <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Quick Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Your Income</p>
                <p className="text-2xl font-bold text-green-400">Rs. {summary.totalIncome.toFixed(0)}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Your Expense</p>
                <p className="text-2xl font-bold text-red-400">Rs. {summary.totalExpense.toFixed(0)}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Your Balance</p>
                <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                  Rs. {summary.balance.toFixed(0)}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Spent %</p>
                <p className="text-2xl font-bold text-purple-400">
                  {summary.totalIncome > 0 ? ((summary.totalExpense / summary.totalIncome) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
