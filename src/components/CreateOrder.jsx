import React, { useState, useEffect } from 'react';
import API from '../utils/api'; // your axios or fetch wrapper
import { useNavigate } from 'react-router-dom';

const CreateOrder = () => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();

  // Get user location on component mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (err) => {
        setError('Unable to retrieve your location');
        setLoadingLocation(false);
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      setError('Location is required');
      return;
    }

    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    setError('');
    setProcessing(true);

    try {
      const userId = localStorage.getItem('userId'); // adjust as per your auth storage
      const userEmail = localStorage.getItem('userEmail'); // adjust as per your auth storage

      const res = await API.post('/payments/create-checkout-session', {
        quantity,
        address,
        location,
        dateTime,
        userId,
        userEmail,
      });

      const { url } = res.data;
      // Redirect to Stripe Checkout page
      window.location.href = url;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment session');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Order</h2>

      {loadingLocation && <p>Fetching your location...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Quantity (liters):
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="w-full border p-2 rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Delivery Address:
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter delivery address"
          />
        </label>

        <label className="block mb-2">
          Delivery Date & Time (optional):
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </label>

        <button
          type="submit"
          disabled={processing || loadingLocation}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {processing ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;
