// On the Admin UI, we want to provide an interface that we can tick/ untick permissions assigned to a Role
// e.g. a set of Actions that an Admin can perform

import { checkbox } from '@keystone-next/fields';

export const permissionFields = {
  canManageProducts: checkbox({
    defaultValue: false,
    label: 'User can Update and delete any product',
  }),
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: 'User can query other users',
  }),
  canManageUsers: checkbox({
    defaultValue: false,
    label: 'User can Edit other users',
  }),
  canManageRoles: checkbox({
    defaultValue: false,
    label: 'User can CRUD roles',
  }),
  canManageCart: checkbox({
    defaultValue: false,
    label: 'User can see and manage cart and cart items',
  }),
  canManageOrders: checkbox({
    defaultValue: false,
    label: 'User can see and manage orders',
  }),
};

// Define the Types for Permission
export type Permission = keyof typeof permissionFields;

// Export the list of permissions
export const permissionsList: Permission[] = Object.keys(
  permissionFields
) as Permission[];
