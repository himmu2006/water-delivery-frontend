import React, { useEffect, useState, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import OrderTable from '../components/OrderTable';
import ProfileSection from '../components/ProfileSection';
import SettingsSection from '../components/SettingsSection';
import { toast } from 'react-toastify'; // ✅ Toast import
import { socket } from '../utils/Socket';

const SupplierDashboard = () => {
  const { user } = useContext(AuthContext);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/suppliers/orders');
      const allOrders = res.data.orders || [];

      setIncomingOrders(allOrders.filter(o => o.status === 'Paid'));
      setActiveOrders(allOrders.filter(o => o.status === 'Accepted'));
      setDeliveredOrders(allOrders.filter(o => o.status === 'Delivered'));
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (user?._id) {
      socket.emit('identify', user._id);
    }

    socket.on('newOrder', ({ order }) => {
      if (order?.status === 'Paid') {
        setIncomingOrders(prev => [order, ...prev]);
      }
    });

    return () => {
      socket.off('newOrder');
    };
  }, [user]);

  const markDelivered = async (orderId) => {
    try {
      await API.put(`/suppliers/deliver/${orderId}`);
      toast.success(`Order successfully Delivered`);
      fetchOrders();
    } catch (err) {
      console.error('Delivery error:', err);
      setError('Failed to mark as delivered');
      toast.error('Failed to mark as delivered');
    }
  };

  const handleAccept = async (orderId) => {
    try {
      await API.post(`/suppliers/respond/${orderId}`, { action: 'accept' });
      toast.success(`Order successfully accepted`); // ✅ Toast on accept
      fetchOrders();
    } catch (err) {
      console.error('Accept error:', err);
      setError('Failed to accept order');
      toast.error('Failed to accept order');
    }
  };

  const handleReject = async (orderId) => {
    try {
      await API.post(`/suppliers/respond/${orderId}`, { action: 'reject' });
      toast.info(`You rejected order ${orderId}`); // ✅ Optional toast on reject
      fetchOrders();
    } catch (err) {
      console.error('Reject error:', err);
      setError('Failed to reject order');
      toast.error('Failed to reject order');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl p-6 rounded-tr-3xl rounded-br-3xl flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-1">
            Hello{user?.name ? `, ${user.name}` : ''}
          </h2>
          <p className="text-sm text-gray-500 mb-8">Welcome to Supplier Panel</p>

          <nav className="space-y-4">
            {[
              ['incoming', 'Incoming Orders'],
              ['active', 'Accepted Orders'],
              ['delivered', 'Delivered Orders'],
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

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg mt-10 shadow-md"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Supplier Dashboard</h2>

        {error && (
          <p className="mb-4 text-center text-red-700 bg-red-100 py-2 rounded">{error}</p>
        )}

        {loading ? (
          <div className="text-center text-blue-600 font-medium animate-pulse">Loading...</div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'incoming' && (
              <OrderTable
                orders={incomingOrders}
                onAccept={handleAccept}
                onReject={handleReject}
                showSupplier={false}
                currentSupplierId={user?._id}
              />
            )}

            {activeTab === 'active' && (
              <OrderTable
                orders={activeOrders}
                onMarkDelivered={markDelivered}
                showSupplier={false}
                currentSupplierId={user?._id}
              />
            )}

            {activeTab === 'delivered' && (
              <OrderTable
                orders={deliveredOrders}
                showSupplier={false}
                currentSupplierId={user?._id}
                showDeliveredToUser={true}
              />
            )}

            {activeTab === 'profile' && <ProfileSection profile={user} />}
            {activeTab === 'settings' && <SettingsSection />}
          </div>
        )}
      </main>
    </div>
  );
};

export default SupplierDashboard;
