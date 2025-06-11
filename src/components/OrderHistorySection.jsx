// src/components/OrderHistorySection.jsx
import React from 'react';

const OrderHistorySection = ({ orders = []}) => {
  // Filter completed or cancelled orders
  const pastOrders = orders.filter(order =>
    ['Delivered', 'Cancelled', 'Rejected'].includes(order.status)
  );

  if (pastOrders.length === 0)
    return <p>No order history found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Order History</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Order ID</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Date/Time</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Supplier</th>
          </tr>
        </thead>
        <tbody>
          {pastOrders.map(order => (
            <tr key={order._id} className="text-center">
              <td className="border border-gray-300 p-2">{order._id}</td>
              <td className="border border-gray-300 p-2">{order.quantity}</td>
              <td className="border border-gray-300 p-2">
                {new Date(order.dateTime).toLocaleString()}
              </td>
              <td className="border border-gray-300 p-2">{order.status}</td>
              <td className="border border-gray-300 p-2">
                {order.supplierId ? order.supplierId.name : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistorySection;
