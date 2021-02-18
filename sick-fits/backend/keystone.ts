import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

// maxAge: lifetime in second assgined to any session tracking cookies
const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long they stay signed in
  secret: process.env.COOKIE_SECRET,
};

config({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    // TODO: Add data seeding
  },
  lists: createSchema({
    // TODO: schema items
  }),
  ui: {
    isAccessAllowed: () => true,
  },
  // TODO: Add session values here
});
