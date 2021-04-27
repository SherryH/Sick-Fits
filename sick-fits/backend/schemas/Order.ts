import { integer, text, relationship, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver: (item, args, context, info) => {
        console.log({ item, args, context, info });
        return `${formatMoney(item.total)}`;
      },
    }),
    charge: text(),
    user: relationship({ ref: 'User.orders' }),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    total: integer(),
  },
});
