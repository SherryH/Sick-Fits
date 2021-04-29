import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export const isSignedIn = ({ session }: ListAccessArgs): boolean => !!session;

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    ({ session }: ListAccessArgs) => !!session?.data.role?.[permission],
  ])
);

// permission based functions that check if someone meets a criteria - true/ false
export const permissions = {
  ...generatedPermissions,
  isAwesome: ({ session }: ListAccessArgs): boolean =>
    !!session.data.name.includes('Sherry'),
};

// Rule based functions
// Rules can return a boolean - true / false
// or a filter which limits what the user can CRUD. filter is an object, like the `where` in graphQL
export const rules = {
  canManageProducts: ({ session }: ListAccessArgs) => {
    // 1. if user has the role which has the canManageProducts permission
    // enable access
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. if user creates his own product, enable access
    return { user: { id: session.itemId } };
  },
  canReadProducts: ({ session }: ListAccessArgs) => {
    // user with canManageProducts permission can view all products
    console.log('rules.canManageProducts', rules?.canManageProducts);
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // otherwise only allow them to see
    // Either: Their own products, in any status
    // OR: only available products
    return {
      OR: [{ user: { id: session.itemId } }, { status: 'AVAILABLE' }],
    };
  },
};
