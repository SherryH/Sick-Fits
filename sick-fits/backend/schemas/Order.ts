import { integer, text, relationship, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: () => false,
    delete: () => false,
  },
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver: (item, args, context, info) => `${formatMoney(item.total)}`,
    }),
    charge: text(),
    user: relationship({ ref: 'User.orders' }),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    total: integer(),
  },
});
