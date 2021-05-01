import { integer, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const CartItem = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: rules.canOrder,
    delete: rules.canOrder,
  },
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
