import Link from 'next/link';
import { useCart } from '../hooks/useCart';
import { CartCount } from './CartCount';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';

export default function Nav() {
  const user = useUser();
  const { openCart } = useCart();
  return (
    <NavStyles>
      <Link href="/products">Products </Link>
      {user && (
        <>
          <Link href="/sell">Sell </Link>
          <Link href="/order">Orders </Link>
          <Link href="/account">Account</Link>
          <SignOut />
          <button type="button" onClick={openCart}>
            Cart
            <CartCount
              count={user.cartItem.reduce((pre, cur) => {
                console.log('cur', cur);
                return pre + cur.quantity;
              }, 0)}
            />
          </button>
        </>
      )}
      {!user && <Link href="/signin">Sign In</Link>}
    </NavStyles>
  );
}
