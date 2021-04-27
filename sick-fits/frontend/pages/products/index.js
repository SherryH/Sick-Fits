import Pagination from '../../components/Pagination';
import Products from '../../components/Products';

export default function ProductsPage({ page }) {
  return (
    <>
      <Pagination page={page || 1} />
      <Products page={page || 1} />
      <Pagination page={page || 1} />
    </>
  );
}
