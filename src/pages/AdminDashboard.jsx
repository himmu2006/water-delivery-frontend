import React, { useEffect, useState, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import UserCard from '../components/UserCard';
import OrderCard from '../components/OrderCard';
import ProfileSection from '../components/ProfileSection';
import SettingsSection from '../components/SettingsSection';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await API.get('/admin/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Sidebar */}
      <aside className="w-72 h-screen sticky top-0 bg-white shadow-xl p-6 rounded-tr-3xl rounded-br-3xl flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold text-blue-700 mb-1">
            Hello{user?.name ? `, ${user.name}` : ''}
          </h2>
          <p className="text-sm text-gray-500 mb-8">Welcome to Admin Panel</p>

          <nav className="space-y-4">
            {[
              ['users', 'Users'],
              ['suppliers', 'Suppliers'],
              ['completedOrders', 'Completed Orders'],
              ['cancelledOrders', 'Cancelled Orders'],
              ['profile', 'Profile'],
              ['settings', 'Settings'],
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

        <div className="pt-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 w-full rounded-lg shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow h-screen overflow-y-auto p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h2>

        {error && (
          <p className="mb-4 text-center text-red-700 bg-red-100 py-2 rounded">{error}</p>
        )}

        {loading ? (
          <div className="text-center text-blue-600 font-medium animate-pulse">Loading...</div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'users' && (
              <div className="grid md:grid-cols-3 gap-6">
                {users.filter(u => u.role === 'user').map(u => (
                  <UserCard key={u._id} user={u} />
                ))}
              </div>
            )}

            {activeTab === 'suppliers' && (
              <div className="grid md:grid-cols-3 gap-6">
                {users.filter(u => u.role === 'supplier').map(u => (
                  <UserCard key={u._id} user={u} />
                ))}
              </div>
            )}

            {activeTab === 'cancelledOrders' && (
              <div className="grid md:grid-cols-2 gap-6">
                {orders
                  .filter(o => o.status === 'Cancelled')
                  .map(o => (
                    <OrderCard key={o._id} order={o} />
                  ))}
              </div>
            )}

            {activeTab === 'completedOrders' && (
              <div className="grid md:grid-cols-2 gap-6">
                {orders
                  .filter(o => o.status !== 'Cancelled' && o.status !== 'Pending')
                  .map(o => (
                    <OrderCard key={o._id} order={o} />
                  ))}
              </div>
            )}

            {activeTab === 'profile' && <ProfileSection profile={user} />}
            {activeTab === 'settings' && <SettingsSection />}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
