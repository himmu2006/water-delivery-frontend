import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { io } from 'socket.io-client';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import UserDashboard from './pages/UserDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ScrollToTop from './components/ScrollToTop';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, loading, logout } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const location = useLocation();

  // Clear auth on landing at "/"
  useEffect(() => {
    if (location.pathname === '/') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      if (logout) logout();
    }
  }, [location.pathname]);

  // Setup socket when user is authenticated
  useEffect(() => {
    if (user?.id) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      const newSocket = io(backendUrl, {
        withCredentials: true,
        auth: { token: localStorage.getItem('token') },
        transports: ['websocket', 'polling'],
      });

      // Emit user ID after connection (optional, depending on your backend)
      newSocket.emit('identify', user.id);

      // Listen to order-related events
      newSocket.on('order-accepted', (orderId) => {
        toast.success(`Your order ${orderId} was accepted!`);
      });

      newSocket.on('order-delivered', (orderId) => {
        toast.success(`Your order ${orderId} has been delivered!`);
      });

      newSocket.on('order-cancelled', (orderId) => {
        toast.info(`Your order ${orderId} was cancelled.`);
      });

      // Handle disconnects
      newSocket.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          newSocket.connect();
        }
      });

      // Handle token errors
      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        if (err.message.includes('Authentication error')) {
          toast.error('Session expired. Please log in again.');
          logout();
        }
      });

      // Set socket instance in state
      setSocket(newSocket);

      // Cleanup
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [user?.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  return (
    <>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={4000} pauseOnHover theme="light" />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={`/${user.role}-dashboard`} />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to={`/${user.role}-dashboard`} />} />
        <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to={`/${user.role}-dashboard`} />} />
        <Route path="/reset-password/:token" element={!user ? <ResetPasswordPage /> : <Navigate to={`/${user.role}-dashboard`} />} />

        <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminDashboard socket={socket} /> : <Navigate to="/" />} />
        <Route path="/supplier-dashboard" element={user?.role === 'supplier' ? <SupplierDashboard socket={socket} /> : <Navigate to="/" />} />
        <Route path="/user-dashboard" element={user?.role === 'user' ? <UserDashboard socket={socket} /> : <Navigate to="/" />} />

        <Route path="/payment-success" element={user ? <PaymentSuccessPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
