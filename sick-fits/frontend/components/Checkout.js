import { useMutation } from '@apollo/client';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../hooks/useCart';
import SickButton from './styles/SickButton';

const StyledCheckoutForm = styled.form`
  padding: 2rem;
  display: grid;
  border: 1px solid hsl(0deg 0% 0% / 0.25);
  border-radius: 15px;
  box-shadow: 0 1px 2px 2px hsl(0deg 0% 80% / 0.4);
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation checkout($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const CheckoutForm = () => {
  console.log('chekcout');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const stripe = useStripe(); // we only have access to useStripe inside Elements Provider
  const elements = useElements();

  const router = useRouter();
  const { closeCart } = useCart();

  const [checkout, { data, error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION
  );

  async function handleCheckout(e) {
    e.preventDefault();
    // what happens when customer clicks checkout?
    // 1. I want to pay for the items inside the cart
    // 1.1 FE: Start the loader
    setLoading(true);
    nProgress.start();
    // 2. Get the CC info, pass to Stripe
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // 3. FE: Start Page Transition (nProgress started above)

    // 3. Create payment method via Stripe. Receive the Stripe token (CC info tokenised)
    const cardElement = elements.getElement(CardElement);
    // https://stripe.com/docs/payments/accept-a-payment-charges#web
    // https://stripe.com/docs/js/payment_methods/create_payment_method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    console.log({ paymentMethod });
    setError(error);
    if (error) {
      nProgress.done();
      setLoading(false);
      console.log('Stripe Error!', error);
      return;
    }
    // 3.1 Handle any errors from Stripe (invalid card, card expired etc)
    // 4. Pass the cart order and token to BE to process order (custom mutation!)
    const order = await checkout({ variables: { token: paymentMethod.id } });
    console.log('data', data);
    // 4.1 Change the page to view order
    router.push({
      pathname: '/order[id]',
      query: { id: order.data.id },
    });
    // 4.2 Close the cart
    closeCart();
    // 4.3 Turn loader off
    setLoading(false);
    nProgress.done();
    // 5. BE to ask Stripe to charge the card on completed transaction
  }
  return (
    <StyledCheckoutForm>
      <CardElement />
      {error && <p style={{ fontSize: 12, color: 'red' }}>{error.message}</p>}
      {graphQLError && (
        <p style={{ fontSize: 12, color: 'red' }}>{graphQLError.message}</p>
      )}
      <SickButton onClick={handleCheckout}>Checkout</SickButton>
    </StyledCheckoutForm>
  );
};

export const Checkout = () => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};
