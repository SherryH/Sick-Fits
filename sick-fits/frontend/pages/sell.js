import CreateProduct from '../components/CreateProduct';
import { PleaseSignIn } from '../components/PleaseSignIn';

export default function Sell() {
  return (
    <PleaseSignIn>
      <CreateProduct />
    </PleaseSignIn>
  );
}
