import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import API from '../utils/api';

const ForgotPassword = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const roleFromQuery = query.get('role') || 'user';

  const [role, setRole] = useState(roleFromQuery);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setRole(roleFromQuery);
  }, [roleFromQuery]);

  const handleSubmit = async () => {
    setError(null);
    setMsg(null);
    try {
      await API.post('/forgot-password', { email, role });
      setMsg('If this email is registered, a reset link will be sent.');
    } catch {
      setError('Failed to send reset email.');
    }
  };

  return (
    <>
      <Navbar userType={null} />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
        <h2 className="text-3xl font-bold mb-6">Forgot Password</h2>
        <p className="mb-4 text-gray-700">Role: <strong>{role}</strong></p>
        {error && <p className="mb-4 text-red-600">{error}</p>}
        {msg && <p className="mb-4 text-green-600">{msg}</p>}

        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your registered email"
        />

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition mb-4 w-80"
        >
          Send Reset Link
        </button>
      </div>
    </>
  );
};

export default ForgotPassword;
