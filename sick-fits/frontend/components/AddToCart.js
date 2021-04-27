import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const ADD_CART_MUTATION = gql`
  mutation ADD_CART_MUTATION($productId: ID!) {
    addToCart(productId: $productId) {
      quantity
    }
  }
`;

export const AddToCart = ({ id }) => {
  const [addToCart, { loading }] = useMutation(ADD_CART_MUTATION, {
    variables: {
      productId: id,
    },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <button type="button" onClick={addToCart} disabled={loading}>
      Add{loading && 'ing'} To Cart 🛒
    </button>
  );
};
