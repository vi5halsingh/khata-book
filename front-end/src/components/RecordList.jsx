import React, { useState, useEffect, useMemo } from 'react';
import { IoPencil, IoShareSocial, IoTrash } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import TransactionFilter from './TransactionFilter';
import TransactionSummary from './TransactionSummary';
import { Toaster, toast } from 'react-hot-toast';


function RecordList(props) {
  const { moduleFilter } = props || {};
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
    sort: 'newest'
  });
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  // Fetch transactions from API with filters
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      
      let queryParams = [];
      if (filters.type) queryParams.push(`type=${filters.type}`);
      if (filters.startDate) queryParams.push(`startDate=${filters.startDate}`);
      if (filters.endDate) queryParams.push(`endDate=${filters.endDate}`);
      if (filters.sort) queryParams.push(`sort=${filters.sort}`);
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRecords(data.data);
      } else {
        setError( 'Log in and try again');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      const message = 'Failed to connect to server';
toast(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  

  // Apply external module filter (dashboard/income/expense) by updating local filters
  useEffect(() => {
    if (!moduleFilter) return;
    if (moduleFilter === 'dashboard') {
      setFilters(prev => ({ ...prev, type: '' }));
    } else if (moduleFilter === 'income' || moduleFilter === 'expense') {
      setFilters(prev => ({ ...prev, type: moduleFilter }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [filters, props.Adding, props.transactionChanged]); 

  useEffect(() => {
    setSelectedIds(new Set());
  }, [records]);

  const removetransectionForm = () => {
    props.setAdding((p) => p ? false : false);
  };
  

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === records.length) {
        return new Set();
      }
      return new Set(records.map((record) => record._id));
    });
  };

  const selectedRecords = useMemo(
    () => records.filter((record) => selectedIds.has(record._id)),
    [records, selectedIds]
  );

  const createPrintableHtml = (list) => {
    const rows = list
      .map(
        (record, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${record.type?.toUpperCase() || '-'}</td>
            <td>${Number(record.amount || 0).toFixed(2)}</td>
            <td>${record.description || '-'}</td>
            <td>${new Date(record.date).toLocaleDateString()}</td>
          </tr>
        `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Transactions Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
            h1 { text-align: center; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
            th { background-color: #111827; color: #fff; }
            tr:nth-child(even) { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Transaction Summary</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Amount (Rs)</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const handlePrintSelected = () => {
    if (selectedRecords.length === 0) {
      toast.error('Please select at least one transaction to print.');
      return;
    }

    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      toast.error('Unable to open print preview. Please allow pop-ups for this site.');
      return;
    }

    printWindow.document.write(createPrintableHtml(selectedRecords));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadSelected = () => {
    if (selectedRecords.length === 0) {
      toast.error('Please select at least one transaction to save.');
      return;
    }

    const headers = ['Type', 'Amount', 'Description', 'Date'];
    const csvRows = [
      headers.join(','),
      ...selectedRecords.map((record) =>
        [
          record.type,
          Number(record.amount || 0).toFixed(2),
          `"${(record.description || '').replace(/"/g, '""')}"`,
          new Date(record.date).toLocaleDateString(),
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `transactions-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Selected transactions exported successfully.');
  };
  
  // Handle delete transaction
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
          // Remove from local state
          setRecords(records.filter(record => record._id !== id));
          toast.success('Transaction deleted successfully!');
          props.setTransactionChanged((p) => p? false : true);
        } else {
          const data = await response.json();
       const message = 'Failed to delete transaction';
       toast(message);
          
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
        const message =  'Failed to delete transaction';
        toast(message);
      }
    }
  };
  
  // Handle toggle favorite
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
        // Update in local state
        setRecords(records.map(record => 
          record._id === id ? {...record, favorite: !currentFavorite} : record
        ));
      } else {
        const data = await response.json();
      const message = data.msg || 'Failed to update transaction'
              toast(message)
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
const message = 'Failed to update transaction';
toast(message)
    }
  };
  
  // Handle edit description
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
        // Update in local state
        setRecords(records.map(record => 
          record._id === id ? {...record, description: editedDescription} : record
        ));
        setEditingId(null);
        const message = 'Transaction updated successfully!';
        toast(message); 
      } else {
        const data = await response.json();
        const message = data.msg || 'Failed to update transaction';
        toast(message)
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      const message = 'Failed to update transaction';
      toast(message)
    }
  };
  
  return ( <>  
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
    <div onClick={() => removetransectionForm()} className="text-white md:p-5 rounded-lg md:mx-auto mt-5 shadow-lg backdrop-blur-lg border border-white/20 md:max-w-4/5 overflow-y-scroll mb-5 h-[80vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
      <div className="flex flex-col gap-3 bg-gray-800 p-3 rounded-md sticky top-0">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Transactions</h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={records.length > 0 && selectedIds.size === records.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-blue-500"
              />
              Select All
            </label>
            <button
              onClick={handleDownloadSelected}
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs sm:text-sm transition disabled:opacity-50"
              disabled={selectedRecords.length === 0}
            >
              Save CSV
            </button>
            <button
              onClick={handlePrintSelected}
              className="px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm transition disabled:opacity-50"
              disabled={selectedRecords.length === 0}
            >
              Print Selected
            </button>
          </div>
        </div>
        {/* <button className="text-xl">⬅️</button> */}
        {/* <button className="text-xl">➡️</button> */}
      </div>
      
  
      <TransactionSummary transactionChanged={props.transactionChanged} />
   
      <TransactionFilter onFilterChange={handleFilterChange} />
      
      {loading ? (
        <div className="text-center p-5">Loading transactions...</div>
      ) : error ? (
        <div className="text-center p-5 text-[#82181a] bg-[#101828]">{error}</div>
      ) : records.length === 0 ? (
        <div className="text-center p-5">No transactions found. Add your first transaction!</div>
      ) : (
        records.map((record) => (
          <div
            key={record._id}
            className="md:flex items-center justify-between p-3 my-3 rounded-md shadow-md border border-gray-700"
            style={{ backgroundColor: record.type === "income" ? "#1e4620" : "#641e1e" }}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedIds.has(record._id)}
                onChange={() => toggleSelect(record._id)}
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-white font-bold p-2 rounded-md" style={{ backgroundColor: record.type === "income" ? "#4caf50" : "#d32f2f" }}>
              Rs. {record.amount}
            </span>
            </div>
            {editingId === record._id ? (
              <input
                type="text"
                className="bg-gray-800 border p-2 w-3/5 text-white rounded-md"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onBlur={() => saveEdit(record._id)}
                autoFocus
              />
            ) : (
              <div 
                className="bg-transparent p-2 md:w-3/5 text-white overflow-hidden text-ellipsis"
                onClick={() => startEditing(record._id, record.description)}
              >
                {record.description}
              </div>
            )}
            <span className="text-gray-400 text-sm">
              {new Date(record.date).toLocaleDateString()}
            </span>
            <div className="flex gap-2 text-lg">
              <IoPencil 
                className="cursor-pointer hover:text-yellow-400" 
                onClick={() => startEditing(record._id, record.description)}
              />
              <IoShareSocial className="cursor-pointer hover:text-blue-400" />
              <IoTrash 
                className="cursor-pointer hover:text-red-400" 
                onClick={() => handleDelete(record._id)}
              />
            </div>
            <FaStar 
              className={record.favorite ? "text-yellow-400 cursor-pointer" : "text-gray-500 cursor-pointer"} 
              onClick={() => toggleFavorite(record._id, record.favorite)}
            />
          </div>
        ))
      )}
    </div>
    </>
  );
}

export default RecordList;
