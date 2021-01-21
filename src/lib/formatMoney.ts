const formatMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
});

export default formatMoney;
