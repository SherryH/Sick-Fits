import { useContext, useState, createContext } from 'react';

const CartContext = createContext(null);

const { Provider } = CartContext;

export const CartProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function openCart() {
    setCartOpen(true);
  }

  function closeCart() {
    setCartOpen(false);
  }

  return (
    <Provider value={{ cartOpen, toggleCart, openCart, closeCart }}>
      {children}
    </Provider>
  );
};

export const useCart = () => useContext(CartContext);
