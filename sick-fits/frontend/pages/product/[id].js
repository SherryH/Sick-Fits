import { useRouter } from 'next/router';
import SingleProduct from '../../components/SingleProduct';

export default function SingleProductPage() {
  const router = useRouter();
  const { id } = router.query;
  console.log('id?', id);
  return <SingleProduct id={id} />;
}
