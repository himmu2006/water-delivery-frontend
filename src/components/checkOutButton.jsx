import { useStripe } from '@stripe/react-stripe-js';
import API from '../utils/api';

const checkOutButton = ({ quantity }) => {
  const stripe = useStripe();

  const handleClick = async () => {
    const res = await API.post('/payment/create-checkout-session', { quantity });
    const sessionId = res.data.id;
    const stripeInstance = await stripe;

    stripeInstance.redirectToCheckout({ sessionId });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded mt-4"
    >
      Pay & Place Order
    </button>
  );
};

export default checkOutButton;
