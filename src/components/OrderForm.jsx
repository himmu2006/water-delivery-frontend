import React from 'react';

const OrderForm = ({
  quantity,
  setQuantity,
  onSubmit,
  error,
  msg,
  loading
}) => {
  return (
    <section className="mb-10">
      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Place New Order</h3>

      {error && (
        <p className="mb-4 text-center text-red-700 bg-red-100 py-2 rounded">{error}</p>
      )}
      {msg && (
        <p className="mb-4 text-center text-green-700 bg-green-100 py-2 rounded">{msg}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="border border-gray-300 rounded px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Quantity"
        />

        <button
          onClick={onSubmit}
          disabled={loading}
          className={`px-6 py-2 rounded text-white font-semibold transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </section>
  );
};

export default OrderForm;
