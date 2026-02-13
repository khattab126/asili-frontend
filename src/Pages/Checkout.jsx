import React, { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { token, backendUrl, setCartItems, getProductData } = useContext(ShopContext);

  const verifyPaymobPayment = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/paymob/verify`,
        { success: "true", orderId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Payment successful!");
        setCartItems({}); // Clear cart
        await getProductData(); // Refresh product data to update stock levels
        navigate('/orders');
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Payment verification failed");
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default Checkout; 