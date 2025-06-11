import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import OrdersSection from '../components/OrdersSection';
import OrderHistorySection from '../components/OrderHistorySection';
import CreateOrder from '../components/CreateOrder';
import Sidebar from '../components/SideBar';
import ProfileSection from '../components/ProfileSection';
import SettingsSection from '../components/SettingsSection';

import { toast } from 'react-toastify';

const UserDashboard = ({ socket }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user and orders on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await API.get('/auth');
        setUser(userRes.data);

        const ordersRes = await API.get('/orders');
        setOrders(ordersRes.data.orders);

        // Attach socket token + connect if not already connected
        if (socket && !socket.connected) {
          socket.auth = { token: localStorage.getItem('token') };
          socket.connect();
        }

        // Join user-specific room (if needed)
        if (socket && userRes.data?._id) {
          socket.emit('join-user', userRes.data._id);
        }

      } catch (error) {
        toast.error('Failed to load dashboard. Please try again.');
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [socket]);

  // Handle real-time updates
  useEffect(() => {
    if (!socket || !user) return;

    const handleAccepted = (orderId) => {
      toast.success(`Order ${orderId} accepted by a supplier!`);
      refreshOrders();
    };

    const handleDelivered = (orderId) => {
      toast.success(`Order ${orderId} has been delivered!`);
      refreshOrders();
    };

    const handleCancelled = (orderId) => {
      toast.info(`Order ${orderId} was cancelled.`);
      refreshOrders();
    };

    socket.on('order-accepted', handleAccepted);
    socket.on('order-delivered', handleDelivered);
    socket.on('order-cancelled', handleCancelled);

    return () => {
      socket.off('order-accepted', handleAccepted);
      socket.off('order-delivered', handleDelivered);
      socket.off('order-cancelled', handleCancelled);
    };
  }, [socket, user]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const refreshOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Error refreshing orders:', error);
      toast.error('Could not refresh orders.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        user={user}
      />

      <main className="flex-grow p-10 overflow-y-auto">
        {loading ? (
          <div className="text-center text-xl text-blue-600 font-medium animate-pulse">
            Loading your dashboard...
          </div>
        ) : (
          <div className="space-y-8">
            {activeTab === 'orders' && (
              orders.length > 0 ? (
                <OrdersSection
                  orders={orders}
                  refreshOrders={refreshOrders}
                  toast={toast}
                />
              ) : (
                <div className="text-center text-gray-500 text-lg">No orders yet.</div>
              )
            )}
            {activeTab === 'createOrder' && <CreateOrder refreshOrders={refreshOrders} />}
            {activeTab === 'history' && <OrderHistorySection orders={orders} />}
            {activeTab === 'profile' && <ProfileSection profile={user} />}
            {activeTab === 'settings' && <SettingsSection />}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
