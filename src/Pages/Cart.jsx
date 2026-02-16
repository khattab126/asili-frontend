import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import CartTotal from '../ui_components/CartTotal/CartTotal';
import '../style/Cart.css'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Update cartData whenever cartItems or products change
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const product = products.find(p => p._id === items);
            if (product) {
              tempData.push({
                _id: items,
                size: item,
                quantity: cartItems[items][item],
                price: product.price,
                name: product.name,
                image: product.image[0]
              });
            }
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Update cart items in context
        Object.entries(parsedCart).forEach(([itemId, sizes]) => {
          Object.entries(sizes).forEach(([size, quantity]) => {
            if (quantity > 0) {
              updateQuantity(itemId, size, quantity);
            }
          });
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  return (
    <div className='Cart_content'>
      <div className='cart_title'>
        <h2>cart</h2>
      </div>

      <div>
        {cartData.length > 0 ? (
          cartData.map((item, index) => (
            <div key={index} className='q1'>
              <div className='your_cart'>
                <img className='your_product_img' src={item.image} alt={item.name} />
                <div>
                  <p className='your_product_name_'>{item.name}</p>
                  <div className='your_product_info'>
                    <p>{currency}{item.price}</p>
                    <p className='your_product_size'>{item.size}</p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0) {
                    updateQuantity(item._id, item.size, value);
                  }
                }}
                className='your_product_quantity'
                type='number'
                min={1}
                value={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className='delete_your_product'
                src={assets.bin_icon}
                alt='Delete'
              />
            </div>
          ))
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty</p>
          </div>
        )}
      </div>

      {cartData.length > 0 && (
        <>
          <div className='carttotal_section'>
            <div className='carttotal_price'>
              <CartTotal />
            </div>
            <div className='checkout_button'>
              <button onClick={() => navigate('/placeorder')} className='checkout_button_color'>
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
