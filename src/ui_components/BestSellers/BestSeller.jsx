import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import './BestSeller.css';

const BestSeller = () => {
  const { products, currency, optimizeImage } = useContext(ShopContext);
  const [bestSellers, setBestSellers] = React.useState([]);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };
  React.useEffect(() => {
    const besProducts = products.filter((product) => product.bestSellers === true);
    setBestSellers(besProducts.slice(0, 5));
  }, [products]);

  return (
    <div className='BestSeller'>
      <div className="contect">
        <h2>BEST SELLERS</h2>
        <p>Our best selling products</p>
      </div>

      <div className="Best">
        {products.slice(2, 6).map((product) => (
          <div
            key={product._id}
            className="product"
            onClick={() => handleClick(product._id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={optimizeImage(product.image[0], 400)} alt={product.name} loading="lazy" />
            <h3>{product.name}</h3>
            <p>{currency}{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
