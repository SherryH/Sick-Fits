/* eslint-disable */
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { CartItem } from '../schemas/CartItem';
import { Session } from '../types';

// schema auto created by Keystone
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../stripe';

const graphql = String.raw;

interface Argument {
  token: string;
}

export async function checkout(
  root: any,
  { token }: Argument,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Query the current user see if they are signed in
  const sesh = context.session as Session;
  const userId = sesh.itemId;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 1.5. Query the current user
  // get all of the user cart data
  const user = await context.lists.User.findOne({
    where: { id: sesh.itemId },
    resolveFields: graphql`
      name
      email
      cartItem{
        id
        quantity
        product {
          id
          name
          description
          photo {
            id
            image {
              publicUrlTransformed
            }
          }
          status
          price
        }
      }
    `,
  });
  // 2.0 ** When Products are deleted after user puts it into the cart
  const cartItems = user.cartItem.filter((item) => item.product);
  // 2. calculate the total price for the order
  const total = cartItems.reduce((pre: number, cur: CartItemCreateInput) => {
    const curPrice = cur.product.price * cur.quantity;
    return curPrice + pre;
  }, 0);
  console.dir(user, { depth: null });
  // Create Payment with Stripe
  // token is the paymentMethod created on FE, encoded with CC info
  const paymentIntent = await stripeConfig.paymentIntents
    .create({
      payment_method: token,
      amount: total,
      currency: 'eur',
      confirm: true,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });

  // convert CartITems to OrderITems
  // Note: For relationship field, use connect
  const orderItems = cartItems.map((cartItem) => {
    return {
      name: cartItem.product.name,
      description: cartItem.product.description,
      photo: { connect: { id: cartItem.product.photo.id } },
      price: cartItem.product.price,
      quantity: cartItem.quantity,
    };
  });

  // create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      charge: paymentIntent.id,
      user: { connect: { id: userId } },
      items: { create: orderItems },
      total: paymentIntent.amount,
    },
    resolveFields: false,
  });

  // clean up old cart items
  const cartItemIds = user.cartItem.map((cartItem) => cartItem.id);

  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });
  return order;
}
