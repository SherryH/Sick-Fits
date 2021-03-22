import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import { addToCart } from './addToCart';
// https://next.keystonejs.com/apis/config#extend-graphql-schema
// https://graphql.org/learn/schema/

// make a fake graphql tagged template literal
// to get VSCode color coding
const gql = String.raw;

const typeDefs = gql`
  type Mutation {
    addToCart(productId: ID!): CartItem
  }
`;
const resolvers = {
  Mutation: {
    addToCart,
  },
};

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs,
  resolvers,
});
