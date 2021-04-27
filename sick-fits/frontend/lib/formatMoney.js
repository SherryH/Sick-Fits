export const formatMoney = (amount) => {
  console.log('');
  const options = {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  };

  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  // his original price is x100
  return new Intl.NumberFormat('de-DE', options).format(amount / 100);
};
