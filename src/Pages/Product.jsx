import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import '../style/Product.css'; // Ensure you have the correct CSS file
import RelatedProducts from '../ui_components/RelatedProduct/RelatedProduct'; // Ensure you have the correct path to RelatedProducts
import Rating from '../ui_components/Rating/Rating';
import Reviews from '../ui_components/Reviews/Reviews';
import Footer from "../ui_components/Footer/Footer"
const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, optimizeImage } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const fetchProductData = () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  const fetchProductRating = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/reviews/stats/${productId}`);
      if (!response.ok) {
        // If the endpoint doesn't exist or returns an error, set default values
        setAverageRating(0);
        setReviewsCount(0);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setAverageRating(data.averageRating);
        setReviewsCount(data.totalReviews);
      } else {
        setAverageRating(0);
        setReviewsCount(0);
      }
    } catch (error) {
      console.error('Error fetching product rating:', error);
      // Set default values in case of any error
      setAverageRating(0);
      setReviewsCount(0);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchProductRating();
  }, [productId, products]);


  return productData ? (
    <div className="product-container">
      {/* Product Section */}
      <div className="product-section">
        {/* Left Section: Images */}
        <div className="image-section">
          {/* Thumbnails */}
          <div className="thumbnails">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={optimizeImage(item, 100)}
                key={index}
                className={`thumbnail ${image === item ? 'selected-thumbnail' : ''}`}
                alt={`Thumbnail ${index + 1}`}
                loading="lazy"
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="main-image-container">
            <img src={optimizeImage(image, 800)} className="main-image" alt="Main Product" />
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="product-details">
          <h1 className="product-name">{productData.name}</h1>
          <div className="product-rating">
            <Rating value={averageRating} size="medium" />
            <span className="review-count">({reviewsCount} reviews)</span>
          </div>
          <p className="product-price">
            {currency}
            {productData.price.toFixed(2)}
          </p>
          <div className="product-stock">
            <p className="stock-status">
              {size ? (
                productData.sizes.find(s => s.size === size)?.stock > 0 ? (
                  <span className="in-stock">In Stock ({productData.sizes.find(s => s.size === size)?.stock} available)</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )
              ) : (
                <span>Select a size to see availability</span>
              )}
            </p>
          </div>
          <p className="product-description">{productData.description}</p>
          <div className="size-selection">
            <p>Select Size</p>
            <div className="size-buttons">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item.size)}
                  key={index}
                  className={`size-button ${item.size === size ? 'selected-size' : ''}`}
                  disabled={item.stock <= 0}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className={`add-to-cart-button ${!size || productData.sizes.find(s => s.size === size)?.stock <= 0 ? 'disabled' : ''}`}
            disabled={!size || productData.sizes.find(s => s.size === size)?.stock <= 0}
          >
            {!size ? 'SELECT SIZE' : productData.sizes.find(s => s.size === size)?.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>
          <hr className="product-divider" />
          <div className="product-policies">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return & exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and Reviews Tabs */}
      <div className="description-reviews">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviewsCount})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' ? (
            <div className="description-text">
              <p>
                An e-commerce website is an online platform that facilitates the
                buying and selling of products or services over the internet. It
                serves as a virtual marketplace where businesses and individuals can
                showcase their products, interact with customers, and conduct
                transactions without the need for a physical presence. E-commerce
                websites have gained immense popularity due to their convenience,
                accessibility, and the global reach they offer.
              </p>
              <p>
                E-commerce websites typically display products or services along
                with detailed descriptions, images, prices, and any available
                variations (e.g., sizes, colors). Each product usually has its own
                dedicated page with relevant information.
              </p>
            </div>
          ) : (
            <Reviews productId={productId} />
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
      <Footer />
    </div>
  ) : (
    <div className="loading-state">Loading...</div>
  );

};

export default Product;