/* eslint-disable */
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { CartItem } from '../schemas/CartItem';
import { Session } from '../types';

// schema auto created by Keystone
import { CartItemCreateInput } from '../.keystone/schema-types';

export async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('ADDING TO CART!');
  // 1. Query the current user see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2. Query the current users cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity',
  });

  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log(
      `There are already ${existingCartItem.quantity}, increment by 1!`
    );
    // 3. See if the current item is in their cart
    // 4. if it is, increment by 1
    context.lists.cartItem;
    return context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: {
        quantity: existingCartItem.quantity + 1,
      },
      resolveFields: false,
    });
  }
  // 4. if it isnt, create a new cart item!
  return context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
    resolveFields: false,
  });
  console.log('allCartItems', allCartItems);
  // try {
  //   const existingCartItem = await context.lists.CartItem.findOne({
  //     where: { id: productId },
  //     resolveFields: 'id,quantity',
  //   });
  //   console.log('anITem', existingCartItem);

  //   // const [existingCartItem] = allCartItems;
  //   if (existingCartItem) {
  //     console.log(
  //       `There are already ${existingCartItem.quantity}, increment by 1!`
  //       );
  //       // 3. See if the current item is in their cart
  //       // 4. if it is, increment by 1
  //       return context.lists.CartItem.updateOne({
  //         id: productId,
  //         data: {
  //           quantity: existingCartItem.quantity + 1,
  //         },
  //         resolveFields: false,
  //       });
  //     }
  //   } catch(error){
  //     // 4. if it isnt, create a new cart item!
  //     return context.lists.CartItem.createOne({
  //       data: {
  //         product: { connect: { id: productId } },
  //         user: { connect: { id: sesh.itemId } },
  //       },
  //       resolveFields: false,
  //     });
  //   }
}
