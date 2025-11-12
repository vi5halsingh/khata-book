import React, { useState, useEffect } from 'react';
import { IoPencil, IoTrash } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';

function TransactionModule({ moduleType }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");

  // Fetch transactions based on module type (income/expense)
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const queryParam = moduleType === 'income' ? '?type=income' : moduleType === 'expense' ? '?type=expense' : '';
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions${queryParam}`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(data.data || []);
      } else {
        setError('Failed to load transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to connect to server');
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [moduleType]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': localStorage.getItem('authToken')
          },
          credentials: 'include'
        });

        if (response.ok) {
          setTransactions(transactions.filter(t => t._id !== id));
          toast.success('Transaction deleted successfully!');
        } else {
          toast.error('Failed to delete transaction');
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error('Failed to delete transaction');
      }
    }
  };

  const toggleFavorite = async (id, currentFavorite) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        credentials: 'include',
        body: JSON.stringify({
          favorite: !currentFavorite
        })
      });

      if (response.ok) {
        setTransactions(transactions.map(t =>
          t._id === id ? { ...t, favorite: !currentFavorite } : t
        ));
      } else {
        toast.error('Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  const startEditing = (id, description) => {
    setEditingId(id);
    setEditedDescription(description);
  };

  const saveEdit = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        credentials: 'include',
        body: JSON.stringify({
          description: editedDescription
        })
      });

      if (response.ok) {
        setTransactions(transactions.map(t =>
          t._id === id ? { ...t, description: editedDescription } : t
        ));
        setEditingId(null);
        toast.success('Transaction updated successfully!');
      } else {
        toast.error('Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  const moduleTitle = moduleType === 'income' ? 'Income Transactions' : 'Expense Transactions';
  const bgColor = moduleType === 'income' ? '#1e4620' : '#641e1e';
  const amountBgColor = moduleType === 'income' ? '#4caf50' : '#d32f2f';

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
        <h1 className="text-4xl font-bold mb-8">{moduleTitle}</h1>

        {loading ? (
          <div className="text-center py-10">Loading transactions...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-400">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No {moduleType} transactions found</div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="md:flex items-center justify-between p-4 rounded-md shadow-md border border-gray-700"
                style={{ backgroundColor: bgColor }}
              >
                <span className="text-white font-bold p-2 rounded-md mb-2 md:mb-0" style={{ backgroundColor: amountBgColor }}>
                  Rs. {transaction.amount}
                </span>
                {editingId === transaction._id ? (
                  <input
                    type="text"
                    className="bg-gray-800 border p-2 w-full md:w-3/5 text-white rounded-md mb-2 md:mb-0"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    onBlur={() => saveEdit(transaction._id)}
                    autoFocus
                  />
                ) : (
                  <div
                    className="bg-transparent p-2 md:w-3/5 text-white overflow-hidden text-ellipsis cursor-pointer hover:text-blue-400"
                    onClick={() => startEditing(transaction._id, transaction.description)}
                  >
                    {transaction.description}
                  </div>
                )}
                <span className="text-gray-400 text-sm mb-2 md:mb-0">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
                <div className="flex gap-3 text-lg">
                  <IoPencil
                    className="cursor-pointer hover:text-yellow-400 transition-colors"
                    onClick={() => startEditing(transaction._id, transaction.description)}
                  />
                  <IoTrash
                    className="cursor-pointer hover:text-red-400 transition-colors"
                    onClick={() => handleDelete(transaction._id)}
                  />
                  <FaStar
                    className={`cursor-pointer transition-colors ${transaction.favorite ? 'text-yellow-400' : 'text-gray-500'}`}
                    onClick={() => toggleFavorite(transaction._id, transaction.favorite)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TransactionModule;
