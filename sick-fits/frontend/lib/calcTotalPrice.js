export const calcTotalPrice = (cart) =>
  cart.reduce((pre, cartItem) => {
    const { product, quantity } = cartItem;
    // if a product was deleted but they are still in your cart
    if (!product) return pre;
    return pre + product.price * quantity;
  }, 0);
