import React, { useContext } from 'react'
import { ShopContext } from '../../context/ShopContext'
import { useNavigate } from 'react-router-dom';
import './LastCollection.css'
const LatestCollection = () => {
    const { products, currency, optimizeImage } = useContext(ShopContext);

    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/product/${id}`);
    };
    return (
        <div className='latest-collection'>
            <div className="contect">
                <h2>Latest Collection</h2>
                <p>Check out our latest collection of products</p>
            </div>

            <div className="latest-products">
                {products.slice(0, 10).map((product) => (
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

    )
}

export default LatestCollection
