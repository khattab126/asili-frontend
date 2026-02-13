import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import './RelatedProduct.css';

const RelatedProduct = () => {
  const { products, currency, optimizeImage, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <div className='related-products'>
      <h2>RELATED PRODUCTS</h2>
      <div className="related-products-grid">
        {products.slice(0, 5).map((product, index) => (
          <div
            key={index}
            className="related-product-item"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <div className="product-image-container">
              <img src={optimizeImage(product.image[0], 400)} alt={product.name} loading="lazy" />
              <button
                className="quick-add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product._id, product.sizes[0]?.size);
                }}
              >
                + Add to Cart
              </button>
            </div>
            <h3>{product.name}</h3>
            <p className="price">{currency}{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;