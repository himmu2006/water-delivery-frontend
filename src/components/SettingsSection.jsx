import React, { useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify'; // ✅ Import toast

const SettingsSection = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const res = await API.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      toast.success(res.data.message || 'Password changed successfully'); // ✅ Toast on success
      setMessage('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error changing password';
      setError(errorMsg);
      toast.error(`${errorMsg}`); // ✅ Toast on error
    }
  };

  return (
    <section className="flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-gray-700">Current Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Confirm New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </section>
  );
};

export default SettingsSection;
