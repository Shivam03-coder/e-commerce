const useAppLinks = () => {
  const basePath = `/admin`;

  return {
    products: `${basePath}/`,
    orders: `${basePath}/orders`,
    customers: `${basePath}/customers`,
    reports: `${basePath}/reports`,
    featured: `${basePath}/featured`,
    shop: `/shop`,
    cart: `/shop/cart`,
    wishlist : `/shop/wishlist`
  };
};

export default useAppLinks;
