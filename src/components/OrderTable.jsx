import React from 'react';

const OrderTable = ({
  orders,
  onMarkDelivered,
  onAccept,
  onReject,
  onCancel,
  showSupplier,
  currentSupplierId,
  showDeliveredToUser = false,
}) => {
  const showDeliveredAtColumn = orders.length > 0 && orders.every(order => order.status === 'Delivered');

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 rounded-lg table-auto">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-medium">
          <tr>
            {showSupplier && (
              <th className="border border-gray-300 px-4 py-3 text-left">Supplier</th>
            )}
            <th className="border border-gray-300 px-4 py-3 text-left">Quantity</th>
            <th className="border border-gray-300 px-4 py-3 text-left">Status</th>
            <th className="border border-gray-300 px-4 py-3 text-left">Ordered On</th>
            {showDeliveredAtColumn && (
              <th className="border border-gray-300 px-4 py-3 text-left">Delivered At</th>
            )}
            <th className="border border-gray-300 px-4 py-3 text-left">
              {showDeliveredToUser ? 'Delivered To' : 'Action'}
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.length ? (
            orders.map(order => {
              const supplierIdStr =
                typeof order.supplierId === 'string'
                  ? order.supplierId
                  : order.supplierId?._id || null;

              const isUnassigned =
                supplierIdStr === null &&
                ['Pending', 'Paid'].includes(order.status);

              const isAssignedToCurrentSupplier =
                supplierIdStr === currentSupplierId;

              const canCancel =
                ['Pending', 'Accepted', 'Rejected'].includes(order.status) &&
                order.paymentStatus !== 'paid';

              return (
                <tr key={order._id} className="hover:bg-gray-50">
                  {showSupplier && (
                    <td className="border border-gray-300 px-4 py-3">
                      {order.supplierId?.name ||
                        supplierIdStr ||
                        'Not assigned'}
                    </td>
                  )}

                  <td className="border border-gray-300 px-4 py-3">
                    {order.quantity}
                  </td>

                  <td className="border border-gray-300 px-4 py-3 capitalize">
                    {order.status}
                  </td>

                  <td className="border border-gray-300 px-4 py-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  {showDeliveredAtColumn && (
                    <td className="border border-gray-300 px-4 py-3">
                      {new Date(order.updatedAt).toLocaleString()}
                    </td>
                  )}

                  <td className="border border-gray-300 px-4 py-3 space-x-2">
                    {showDeliveredToUser ? (
                      <span className="text-blue-800 font-semibold">
                        {order.userId?.name ||
                          order.userId?.email ||
                          'Unknown User'}
                      </span>
                    ) : (
                      <>
                        {isUnassigned && onAccept && onReject && (
                          <>
                            <button
                              onClick={() => onAccept(order._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => onReject(order._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {isAssignedToCurrentSupplier &&
                          order.status === 'Accepted' &&
                          onMarkDelivered && (
                            <button
                              onClick={() => onMarkDelivered(order._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                            >
                              Mark Delivered
                            </button>
                          )}

                        {canCancel && onCancel && (
                          <button
                            onClick={() => onCancel(order._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                          >
                            Cancel
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={showSupplier ? (showDeliveredAtColumn ? 6 : 5) : (showDeliveredAtColumn ? 5 : 4)} className="text-center py-4 text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
