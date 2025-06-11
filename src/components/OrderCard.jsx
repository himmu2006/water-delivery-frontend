import React from 'react';

const OrderCard = ({ order, onMarkDelivered }) => {
  return (
    <div className="border border-gray-300 rounded p-4 mb-4 shadow-sm hover:shadow-md transition">
      <h4 className="font-semibold mb-2">Order ID: {order._id}</h4>

      {/* Display User Name */}
      <p><strong>Ordered By:</strong> {order.userId?.name || 'Unknown User'}</p>

      {/* Display Supplier Name */}
      <p><strong>Supplier:</strong> {order.supplierId?.name || 'N/A'}</p>

      {/* Other Order Details */}
      <p><strong>Quantity:</strong> {order.quantity}</p>
      <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
      <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>

      {/* Mark as Delivered Button */}
      {onMarkDelivered && order.status !== 'Delivered' && (
        <button
          onClick={() => onMarkDelivered(order._id)}
          className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
        >
          Mark Delivered
        </button>
      )}
    </div>
  );
};

export default OrderCard;
