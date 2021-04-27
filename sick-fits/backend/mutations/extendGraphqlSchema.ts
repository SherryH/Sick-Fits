import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import { addToCart } from './addToCart';
import { checkout } from './checkout';
// https://next.keystonejs.com/apis/config#extend-graphql-schema
// https://graphql.org/learn/schema/

// make a fake graphql tagged template literal
// to get VSCode color coding
const graphql = String.raw;

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): CartItem
      checkout(token: String!): Order
    }
  `,
  resolvers: {
    Mutation: {
      addToCart,
      checkout,
    },
  },
});
