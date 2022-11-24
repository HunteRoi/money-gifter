import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutForm from './CheckoutForm';
import PaymentForm from '../components/PaymentForm';

function Payment({ amount }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentDetails, setDetails] = useState({
    amount: 5,
    isAnonymous: true,
    name: '',
    message: null
  });
  useEffect(() => {
    fetch('/config').then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: paymentDetails.amount
      }),
    }).then(async (result) => {
      var { clientSecret } = await result.json();
      setClientSecret(clientSecret);
    });
  }, [paymentDetails.amount]);

  const onSuccess = () => {
    fetch('/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentDetails)
    });
  };

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      <PaymentForm />
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm callback={onSuccess} />
        </Elements>
      )}
    </>
  );
}

export default Payment;
