import styled from 'styled-components';
import { useCart } from '../hooks/useCart';
import { calcTotalPrice } from '../lib/calcTotalPrice';
import { formatMoney } from '../lib/formatMoney';
import { Checkout } from './Checkout';
import { RemoveFromCart } from './RemoveFromCart';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import { useUser } from './User';

const StyledCartItemWrapper = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  img {
    margin-right: 1rem;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = ({ cartItem }) => {
  // display the cart items in a grid
  const { product, quantity, id } = cartItem;
  const imageSrc = product.photo.image.publicUrlTransformed;
  const { altText } = product.photo;
  return (
    <StyledCartItemWrapper>
      <img src={imageSrc} alt={altText} width="100px" />
      <div>
        <h3>{product.name}</h3>
        <p>
          {formatMoney(product.price * quantity)} -
          <em>
            {quantity} &times; {formatMoney(product.price)} each
          </em>
        </p>
      </div>
      <RemoveFromCart id={id} />
    </StyledCartItemWrapper>
  );
};

const Cart = () => {
  const { cartOpen, closeCart } = useCart();

  const user = useUser();
  if (!user) return null;

  const cart = user?.cartItem;
  return (
    <CartStyles open={cartOpen}>
      <CloseButton type="button" onClick={closeCart}>
        &times;
      </CloseButton>
      <header>
        <Supreme>My Cart</Supreme>
      </header>
      <ul>
        {cart?.map((singleCartItem) => (
          <CartItem key={singleCartItem.id} cartItem={singleCartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(cart))}</p>
        <Checkout />
      </footer>
    </CartStyles>
  );
};

export default Cart;
