import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-lg mb-6">Thank you for your order. Your payment has been processed successfully.</p>
      <Link 
        to="/dashboard" 
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default PaymentSuccess;
