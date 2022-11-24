import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from 'react-bootstrap';

import CheckoutForm from './CheckoutForm';
import PaymentForm from '../components/PaymentForm';

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [firstStepDone, goToNextStep] = useState(false);
  const [paymentDetails, setDetails] = useState({
    amount: -1,
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
    if (paymentDetails.amount < 0) return;

    fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: paymentDetails.amount
      }),
    }).then(async (result) => {
      var { clientSecret, id } = await result.json();
      setClientSecret(clientSecret);
      setPaymentId(id);
    });
  }, [paymentDetails.amount]);

  const saveMetadata = () => {
    fetch('/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...paymentDetails, id: paymentId, dateCreated: Date.now() })
    });
  };

  const onNext = (details) => {
    setDetails(details);
    goToNextStep(true);
  };

  const onPrevious = () => goToNextStep(false);

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      { !firstStepDone
          ? <PaymentForm onNext={onNext} />
          : clientSecret && stripePromise && (
          <>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm saveMetadata={saveMetadata} />
            </Elements>
            <Button variant='primary' onClick={onPrevious}>Previous</Button>
          </>
      )}
    </>
  );
}

export default Payment;
