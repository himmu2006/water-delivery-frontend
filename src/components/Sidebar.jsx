import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, handleLogout, user }) => {
  return (
    <aside className="w-72 h-screen bg-gray-100 shadow-xl p-6 rounded-tr-3xl rounded-br-3xl flex flex-col">
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* ✅ Greeting with username */}
        <h2 className="text-xl font-bold text-blue-700 mb-1">
          Hello{user?.name ? `, ${user.name}` : ''}
        </h2>
        <p className="text-sm text-gray-500 mb-8">Welcome to your dashboard</p>

        {/* Tabs */}
        <nav className="space-y-4">
          {[
            ['orders', 'Orders'],
            ['createOrder', 'Create Order'],
            ['history', 'Order History'],
            ['profile', 'Profile'],
            ['settings', 'Settings']
          ].map(([key, label]) => (
            <button
              key={key}
              className={`w-full text-left px-4 py-3 font-medium text-lg rounded-lg transition duration-300 ${
                activeTab === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-blue-100 text-blue-800'
              }`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Fixed Logout Button */}
      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 w-full rounded-lg shadow-md"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
