import React from 'react';
import { IoLogOut } from 'react-icons/io5';
import { MdAccountCircle } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar({ activeModule, setActiveModule }) {
  const navigate = useNavigate();
  const items = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expense' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <aside className="w-56 bg-gray-900 text-white min-h-screen p-4 fixed left-0 top-0 z-30 border-r border-gray-700 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold mb-4">Modules</h3>
        <nav className="flex flex-col gap-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`text-left px-3 py-2 rounded-md transition-colors hover:bg-gray-800/60 ${activeModule === item.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-transparent'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile & Logout Section */}
      <div className="border-t border-gray-700 pt-4 flex flex-col gap-2">
        <Link
          to="/profile"
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
        >
          <MdAccountCircle className="text-xl" />
          <span>Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-900 hover:bg-red-800 transition-colors text-sm text-white"
        >
          <IoLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
