import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import { DisplayError } from './ErrorMessage';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

export const TOTAL_PRODUCTS_QUERY = gql`
  query TOTAL_PRODUCTS_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export default function Pagination({ page }) {
  const { data, loading, error } = useQuery(TOTAL_PRODUCTS_QUERY);
  if (error) return <DisplayError />;
  const count = data?._allProductsMeta?.count;
  const totalPage = Math.ceil(count / perPage);
  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fit Page | {page} of {totalPage}{' '}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={loading || page <= 1}>{`<- Prev`} </a>
      </Link>
      <div>
        Page {page} of {totalPage}
      </div>
      <div>{`${count} Items Total`}</div>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={loading || page >= totalPage}> {`Next ->`} </a>
      </Link>
    </PaginationStyles>
  );
}
