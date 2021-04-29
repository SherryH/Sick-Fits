import { config, createSchema } from '@keystone-next/keystone/schema';
import {
  statelessSessions,
  withItemData,
} from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';
import 'dotenv/config';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { CartItem } from './schemas/CartItem';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { Role } from './schemas/Role';
import { permissionsList } from './schemas/fields';
import { insertSeedData } from './seed-data';
import { sendPasswordResetToken } from './mail';
import { extendGraphqlSchema } from './mutations/extendGraphqlSchema';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long they stay signed in?
  secret: process.env.COOKIE_SECRET,
};

// set auth! another beast!
// https://github.com/keystonejs/keystone/blob/master/examples-next/auth/keystone.ts
// in our case, it is the User that logs in
// initFirstItem: chicken egg problem - we turn on auth, no user, then turn it off..
// we can add in inital roles and that will be the initial admin
const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email', // how we identify the user
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in initial roles here
  },
  passwordResetLink: {
    sendToken: async ({ itemId, identity, token }) => {
      console.log('send mail', itemId, identity, token);
      // identity is email
      // itemId is userId
      await sendPasswordResetToken(token, identity);
    },
    tokensValidForMins: 60,
  },
});

export default withAuth(
  config({
    // @ts-ignore
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // TODO: Add data seeding here
      async onConnect(keystoneContext) {
        if (process.argv.includes('--seed-data')) {
          // console.log('db connect', keystoneContext);
          await insertSeedData(keystoneContext);
        }
      },
    },
    lists: createSchema({
      // Schema items go in here
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
      Role,
    }),
    extendGraphqlSchema,
    ui: {
      // Show the Admin UI only for people who pass this test
      // it receives a session, we can check who this is from the session
      // on initial login, session?.data is falsy, and user will be prompted to create first user
      // initFirstItem!
      isAccessAllowed: ({ session }) => !!session?.data,
    },
    // everytime we query, we will get the user session with User id returned sessison.data.id
    // User: 'id email', => session.data.email is also returned
    session: withItemData(statelessSessions(sessionConfig), {
      // graphQL query
      User: `id name email role { ${permissionsList.join(' ')} }`,
    }),
  })
);
