const useAppLinks = () => {
  const basePath = `/admin`;

  return {
    dashboard: basePath,
    products: `${basePath}/products`,
    orders: `${basePath}/orders`,
    customers: `${basePath}/customers`,
    reports: `${basePath}/reports`,
  };
};

export default useAppLinks;
