import { integer, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const CartItem = list({
  fields: {
    quantity: integer({ isRequired: true, defaultValue: 1 }),
    product: relationship({ ref: 'Product' }),
    user: relationship({ ref: 'User.cartItem' }),
  },
  ui: {
    listView: {
      initialColumns: ['product', 'quantity', 'user'],
    },
  },
});
