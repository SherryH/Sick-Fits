import { relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { permissionFields } from './fields';

export const Role = list({
  fields: {
    name: text({ isRequired: true }),
    ...permissionFields,
    assignedTo: relationship({
      ref: 'User.role',
      many: true, // 1 Role can have many users. e.g. many users can be admin
      ui: {
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
