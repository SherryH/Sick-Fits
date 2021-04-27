import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import HEAD from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import { DisplayError } from './ErrorMessage';

const PRODUCT_QUERY = gql`
  query PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      description
      price
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;
const ProductStyle = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-width: 800px;
  max-width: var(--maxWidth);
  justify-items: center;
  align-items: top;
  gap: 2rem;
  img {
    max-width: 100%;
    object-fit: contain;
  }
`;

export default function SingleProduct({ id }) {
  // pull in the product from gql
  const { data, loading, error } = useQuery(PRODUCT_QUERY, {
    variables: { id },
  });
  console.log(data);

  // console.log({ data, loading });
  if (loading) return 'loading...';
  if (error) return <DisplayError error={error} />;
  const { name, description, photo } = data?.Product;
  console.log({ name, description, photo });
  return (
    <ProductStyle>
      <HEAD>
        <title>Sick Fit | {name}</title>
      </HEAD>
      <img src={photo?.image?.publicUrlTransformed} alt={photo?.altText} />
      <div className="details">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
      <Link href={{ pathname: 'update', query: { id } }}>
        <button type="button">Update Item</button>
      </Link>
    </ProductStyle>
  );
}
