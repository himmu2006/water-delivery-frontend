import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify'; // ✅ Import toast

const OrdersSection = ({ orders, refreshOrders }) => {
  const [updatedOrders, setUpdatedOrders] = useState(orders);

  useEffect(() => {
    const fetchLatestOrders = async () => {
      try {
        const res = await API.get('/orders');
        setUpdatedOrders(res.data.orders);
      } catch (error) {
        console.error('Failed to fetch latest orders:', error);
      }
    };

    fetchLatestOrders();
  }, [orders]);

  const activeOrders = updatedOrders.filter(order =>
    ['Pending', 'Accepted', 'Paid'].includes(order.status)
  );

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await API.delete(`/orders/${orderId}`);
      toast.success('Order cancelled successfully'); // ✅ Updated
      refreshOrders();
    } catch (error) {
      toast.error('Failed to cancel order: ' + (error.response?.data?.message || error.message)); // ✅ Updated
    }
  };

  if (activeOrders.length === 0)
    return <p>No active orders found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Active Orders</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Order ID</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Date/Time</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Payment</th>
            <th className="border border-gray-300 p-2">Supplier</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeOrders.map(order => (
            <tr key={order._id} className="text-center">
              <td className="border border-gray-300 p-2">{order._id}</td>
              <td className="border border-gray-300 p-2">{order.quantity}</td>
              <td className="border border-gray-300 p-2">
                {new Date(order.dateTime).toLocaleString()}
              </td>
              <td className="border border-gray-300 p-2">{order.status}</td>
              <td className="border border-gray-300 p-2">{order.paymentStatus || 'unpaid'}</td>
              <td className="border border-gray-300 p-2">
                {order.supplierId ? order.supplierId.name : 'Not assigned'}
              </td>
              <td className="border border-gray-300 p-2">
                {(order.status !== 'Delivered' && order.paymentStatus !== 'paid') && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersSection;
