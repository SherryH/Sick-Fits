import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

export const User = list({
  access: {},
  ui: {},
  fields: {
    name: text({ isRequired: true }),
    email: text({
      isRequired: true,
      isUnique: true,
    }),
    // The user's password, used as the secret field for auth
    password: password({}),
    cartItem: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    orders: relationship({ ref: 'Order.user', many: true }),
  },
});
