import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    authenticatedItem {
      ... on User {
        id
        name
        email
        cartItem {
          id
          quantity
          product {
            id
            name
            price
            photo {
              altText
              image {
                publicUrlTransformed
              }
            }
          }
        }
      }
    }
  }
`;
export const useUser = () => {
  const { data } = useQuery(CURRENT_USER_QUERY);
  return data?.authenticatedItem;
};
