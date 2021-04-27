import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const StyledButton = styled.button`
  border: 0;
  padding: 0;
  background: none;
  font-size: 3rem;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const DELETE_CARTITEM_MUTATION = gql`
  mutation DELETE_CARTITEM_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

const update = (cache, payload) => {
  console.log('deleteCartItem', payload.data.deleteCartItem);
  cache.evict(cache.identify(payload.data.deleteCartItem));
};

export const RemoveFromCart = ({ id }) => {
  const [deleteCartItem, { loading }] = useMutation(DELETE_CARTITEM_MUTATION, {
    variables: { id },
    update,
  });
  return (
    <StyledButton
      title="Remove this itme from cart"
      type="button"
      onClick={deleteCartItem}
      disabled={loading}
    >
      &times;
    </StyledButton>
  );
};
