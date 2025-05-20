import React from "react";
import { useState } from "react";
import { IoCloseCircleOutline}  from "react-icons/io5";
import { ToastBar , toast } from "react-hot-toast";
 
function AddNewTransection({ Adding , setAdding}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
    const [type, setType] = useState("income");
    const [hidden , setHidden] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: Number(amount),
          description,
          type
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        const message = 'Transaction added successfully!';
        toast.success(message)
        // Reset form fields
        setAmount('');
        setDescription('');
        setType('income');
        // Close the form and trigger a refresh of the transaction list
        if (window.location.pathname === '/see-record' && window.closeTransactionForm) {
          window.closeTransactionForm();
        }
      } else {
        const message = (` ${'Failed to add transaction'}`);
        toast.error(message);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      const message = ('Failed to add transaction. Please try again.');
      toast.error(message);
    }
    
    setAdding((hidden) => !hidden);
  };
 
  return (
    <div className={`${hidden} ? "hidden"  : "visible"  bg-[#121212] text-white p-5 rounded-lg max-w-[95%] md:max-w-3/5 w-full shadow-lg absolute top-20 md:top-35 left-1/2 -translate-x-1/2 md:left-1/5 md:translate-x-0`}>
      <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>
      {Adding && (
            <button className="text-5xl text-[#82181a] font-medium pointer absolute top-0 right-5 cursor-pointer">
              <IoCloseCircleOutline onClick={() => setAdding((add) => !add)} />
            </button>
          )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-gray-800 p-3 rounded-md border border-gray-700 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-800 p-3 rounded-md border border-gray-700 focus:outline-none"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-gray-800 p-3 rounded-md border border-gray-700 focus:outline-none"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit" className="bg-green-600 p-3 rounded-md text-white font-bold hover:bg-green-700 transition duration-300">
          Add Transaction
        </button>
      </form>
    </div>
  );
}
export default AddNewTransection;