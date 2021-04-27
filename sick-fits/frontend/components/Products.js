import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import { perPage } from '../config';
import Product from './Product';

export const ALLPRODUCTS_QUERY = gql`
  query allProductsQuery($skip: Int = 0, $first: Int) {
    allProducts(skip: $skip, first: $first) {
      id
      name
      description
      status
      photo {
        image {
          publicUrlTransformed
        }
        altText
      }
      price
    }
  }
`;

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export default function Products({ page }) {
  const { data, error, loading } = useQuery(ALLPRODUCTS_QUERY, {
    variables: {
      skip: page * perPage - perPage,
      first: perPage,
    },
  });
  console.log('products page', page);
  // const skip =
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {`${error.message}`}</p>;
  return (
    <ProductsListStyles>
      {data?.allProducts?.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </ProductsListStyles>
  );
}
