import 'dotenv/config';
import Stripe from 'stripe';

const stripeConfig = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2020-08-27',
});

export default stripeConfig;

export const chargeWithStripe = async ({ token, total }) => {
  const paymentIntent = await stripeConfig.paymentIntents.create({
    payment_method: token,
    amount: total,
    currency: 'eur',
    confirm: true,
  });
  return paymentIntent;
};
