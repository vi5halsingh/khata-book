import React, { useState, useEffect } from 'react';
import { IoPencil, IoShareSocial, IoTrash } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import TransactionFilter from './TransactionFilter';
import TransactionSummary from './TransactionSummary';


function RecordList(props) {
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
      
      const response = await fetch(`http://localhost:5000/api/transactions${queryString}`, {
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
        setError( 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTransactions();
  }, [filters, props.Adding]); 

  const removetransectionForm = () => {
    props.setAdding((p) => p ? false : false);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Handle delete transaction
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': localStorage.getItem('authToken')
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          // Remove from local state
          setRecords(records.filter(record => record._id !== id));
        } else {
          const data = await response.json();
          alert(data.msg || 'Failed to delete transaction');
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };
  
  // Handle toggle favorite
  const toggleFavorite = async (id, currentFavorite) => {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
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
        alert(data.msg || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };
  
  // Handle edit description
  const startEditing = (id, description) => {
    setEditingId(id);
    setEditedDescription(description);
  };
  
  const saveEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
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
      } else {
        const data = await response.json();
        alert(data.msg || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };
  
  return ( <>  
    <div onClick={() => removetransectionForm()} className="text-white p-5 rounded-lg mx-auto mt-5 shadow-lg backdrop-blur-lg border border-white/20 max-w-4/5 overflow-y-scroll mb-5 h-[80vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
      <div className="flex justify-center items-center bg-gray-800 p-3 rounded-md sticky top-0">
        {/* <button className="text-xl">⬅️</button> */}
        <h2 className="text-xl font-bold">Transactions</h2>
        {/* <button className="text-xl">➡️</button> */}
      </div>
      
  
      <TransactionSummary />
   
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
            className="flex items-center justify-between p-3 my-3 rounded-md shadow-md border border-gray-700"
            style={{ backgroundColor: record.type === "income" ? "#1e4620" : "#641e1e" }}
          >
            <span className="text-white font-bold p-2 rounded-md" style={{ backgroundColor: record.type === "income" ? "#4caf50" : "#d32f2f" }}>
              Rs. {record.amount}
            </span>
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
                className="bg-transparent p-2 w-3/5 text-white overflow-hidden text-ellipsis"
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
