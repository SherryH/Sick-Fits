import { useRouter } from 'next/router';
import UpdateProduct from '../components/UpdateProduct';

export default function UpdatePage({ query }) {
  const router = useRouter();
  const { id } = router.query;
  console.log('id', id);
  return <UpdateProduct id={query.id} />;
}
