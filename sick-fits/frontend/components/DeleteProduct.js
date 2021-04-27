import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading, error }] = useMutation(
    DELETE_PRODUCT_MUTATION,
    {
      variables: { id },
      update: (cache, { data }) => {
        cache.evict(cache.identify(data.deleteProduct));
        cache.gc();
      },
    }
  );

  return (
    <button
      type="button"
      id={id}
      disabled={loading}
      onClick={async () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Are you sure you want to delete the product?')) {
          console.log('dele?');
          await deleteProduct().catch((err) =>
            alert('Product Deletion Error', err)
          );
        }
      }}
    >
      {children}
    </button>
  );
}
