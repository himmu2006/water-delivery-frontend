import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';

const ResetPassword = () => {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const roleFromQuery = query.get('role') || 'user';

  const [role, setRole] = useState(roleFromQuery);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setRole(roleFromQuery);
  }, [roleFromQuery]);

  const handleReset = async () => {
    setError(null);
    setMsg(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await API.post(`/reset-password/${token}`, { password, confirmPassword, role });
      setMsg('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate(`/login?role=${role}`), 3000);
    } catch {
      setError('Failed to reset password. Token might be invalid, expired, or role mismatch.');
    }
  };

  return (
    <>
      <Navbar userType={null} />
      <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 flex flex-col justify-center items-center p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 space-y-6">
          <h2 className="text-4xl font-extrabold text-indigo-700 text-center mb-4">Reset Password</h2>
          <p className="text-center text-gray-600 font-semibold mb-6">
            Role: <span className="text-indigo-600">{role}</span>
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 rounded-md px-4 py-2 mb-4">
              {error}
            </div>
          )}
          {msg && (
            <div className="bg-green-100 text-green-700 border border-green-400 rounded-md px-4 py-2 mb-4">
              {msg}
            </div>
          )}

          <FormInput
            label="New Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="focus:ring-indigo-500 focus:border-indigo-500"
          />
          <FormInput
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button
            onClick={handleReset}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reset Password
          </button>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
