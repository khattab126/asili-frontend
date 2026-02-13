import React, { useContext, useState, useEffect } from 'react';
import '../style/Collection.css';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Collection = () => {
  const navigate = useNavigate();
  const { products, search, optimizeImage } = useContext(ShopContext);
  const [filters, setFilters] = useState({
    categories: [],
    types: []
  });
  const [sortOption, setSortOption] = useState("relevant");
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };

  // Get dynamic categories and subcategories
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const categories = [...new Set(products.map(item => item.category))].filter(Boolean);
      const subcategories = [...new Set(products.map(item => item.subcategory))].filter(Boolean);
      setAvailableCategories(categories);
      setAvailableSubcategories(subcategories);
    }
  }, [products]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  // Apply filter and sort logic
  useEffect(() => {
    let filtered = products.slice();

    // Filter by search
    if (search.trim() !== "") {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item =>
        filters.categories.includes(item.category)
      );
    }

    // Filter by subcategory (previously using item.subcategory but logic used filters.types)
    if (filters.types.length > 0) {
      filtered = filtered.filter(item =>
        filters.types.includes(item.subcategory)
      );
    }

    // Sort
    if (sortOption === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setDisplayedProducts(filtered);
  }, [filters, search, sortOption, products]);

  return (
    <div className="collection-page">
      <div className="collection-main-container">
        {/* Filters Section */}
        <div className="collection-filter-container">
          <div className="collection-filter-options">
            <p className="desktop-filter-title">FILTERS</p>

            {availableCategories.length > 0 && (
              <div className="collection-category-box">
                <p className="collection-category-title">CATEGORIES</p>
                <div className="collection-category-list">
                  {availableCategories.map(category => (
                    <div key={category} className="collection-checkbox-row">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onChange={() => handleFilterChange('categories', category)}
                      />
                      <label htmlFor={`category-${category}`}>{category}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {availableSubcategories.length > 0 && (
              <div className="collection-category-box">
                <p className="collection-category-title">SUB CATEGORIES</p>
                <div className="collection-category-list">
                  {availableSubcategories.map(type => (
                    <div key={type} className="collection-checkbox-row">
                      <input
                        type="checkbox"
                        id={`type-${type}`}
                        checked={filters.types.includes(type)}
                        onChange={() => handleFilterChange('types', type)}
                      />
                      <label htmlFor={`type-${type}`}>{type}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Products Section */}
        <div className="right-side-products">
          <div className="header-container">
            <h1>ALL COLLECTIONS</h1>
            <select
              className="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
          <div className="products-grid">
            {displayedProducts?.length > 0 ? (
              displayedProducts.map((product) => (
                <div
                  key={product._id}
                  className="product-card"
                  onClick={() => handleClick(product._id)}
                >
                  <img src={optimizeImage(product.image[0], 400)} alt={product.name} loading="lazy" />
                  <h3>{product.name}</h3>
                  <span>EGP {product.price.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>No products match your search/filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;