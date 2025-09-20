// Legacy ProductCard - Redirects to new ProductTile
// This maintains backward compatibility while using the new professional component

import ProductTile from './ProductTile';

/**
 * @deprecated Use ProductTile instead for better performance and features
 * This component is maintained for backward compatibility
 */
const ProductCard = (props) => {
  console.warn('ProductCard is deprecated. Please use ProductTile instead for better performance and features.');
  return <ProductTile {...props} />;
};

export default ProductCard;