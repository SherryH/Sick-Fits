import Products from './index';

export default function ProductsPage({ query }) {
  const page = parseInt(query.page);
  return <Products page={page} />;
}
