import Link from 'next/link';

import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import { formatMoney } from '../lib/formatMoney';

export default function Product({ product }) {
  return (
    <ItemStyles>
      <img
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product?.photo?.altText}
      />
      <Title key={product.id}>
        <Link href={`/product/${product.id}`}>
          <a>{product.name}</a>
        </Link>
      </Title>
      <PriceTag>{formatMoney(product?.price)}</PriceTag>
      <p>{product.description}</p>
      {/** TODO: Add buttons to edit and delete items */}
      {console.log('product.id,', product.id)}
      <div className="buttonList">
        <Link href={{ pathname: 'update', query: { id: product.id } }}>
          Edit -
        </Link>
      </div>
    </ItemStyles>
  );
}
