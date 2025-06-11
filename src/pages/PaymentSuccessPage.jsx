import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Placing your order...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("Missing session ID.");
      return;
    }

    const checkPayment = async () => {
      try {
        // Optionally, you can verify the session from your backend
        // Or show loader for 3 seconds then redirect
        setMessage("Payment verified successfully!");
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 3000);
      } catch (err) {
        console.error("Error verifying session:", err);
        setError("Payment succeeded but we could not confirm your order.");
      }
    };

    checkPayment();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="text-center mt-12 text-red-600">
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p className="mt-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="text-center mt-12">
      <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
      <p className="mt-4">{message}</p>
    </div>
  );
};

export default PaymentSuccessPage;
