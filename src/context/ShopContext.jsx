import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { products } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  // Initialize cartItems from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return {};
    }
  });
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const currency = "EGP";
  const [deliveryFee, setDeliveryFee] = useState(3); // Default to Cairo's fee
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Save cartItems to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Initialize token and cart from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
      getUserCart(storedToken);
    } else if (!storedToken) {
      // If not logged in, ensure we have the local cart
      const localCart = localStorage.getItem('cartItems');
      if (localCart) {
        try {
          setCartItems(JSON.parse(localCart));
        } catch (error) {
          console.error('Error loading local cart:', error);
        }
      }
    }
  }, []);

  // Watch for token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const updateDeliveryFee = (governorate) => {
    // Default to Cairo's fee if governorate not found
    const fees = {
      'Cairo': 3,
      'Giza': 3,
      'Qalyubia': 3,
      'Helwan': 3,
      'Alexandria': 4,
      'Beheira': 4,
      'Gharbia': 4,
      'Kafr El Sheikh': 4,
      'Dakahlia': 4,
      'Damietta': 4,
      'Sharqia': 4,
      'Monufia': 4,
      'Faiyum': 5,
      'Beni Suef': 5,
      'Minya': 5,
      'Asyut': 6,
      'Sohag': 6,
      'Qena': 7,
      'Luxor': 7,
      'Aswan': 8,
      'Port Said': 5,
      'Ismailia': 5,
      'Suez': 5,
      'North Sinai': 8,
      'South Sinai': 8,
      'Red Sea': 8,
      'New Valley': 8,
      'Matrouh': 8
    };
    setDeliveryFee(fees[governorate] || 3);
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }
    try {
      const product = products.find(p => p._id === itemId);
      if (!product) {
        toast.error('Product not found');
        return;
      }
      if (product.quantity <= 0) {
        toast.error('Product is out of stock');
        return;
      }
      let cartData = structuredClone(cartItems || {});
      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          if (cartData[itemId][size] >= product.quantity) {
            toast.error('No more items available in stock');
            return;
          }
          cartData[itemId][size] += 1;
        }
        else {
          cartData[itemId][size] = 1;
        }
      }
      else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }
      setCartItems(cartData);
      if (token) {
        await axios.post(`${backendUrl}/api/cart/add`,
          { itemId, size },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  }
  const updateQuantity = async (itemID, size, quantity) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (!newCart[itemID]) newCart[itemID] = {};

      if (quantity === 0) {
        delete newCart[itemID][size];
        if (Object.keys(newCart[itemID]).length === 0) {
          delete newCart[itemID];
        }
      } else {
        newCart[itemID][size] = quantity;
      }
      return newCart;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemID, size, quantity },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (!product) continue;

      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        totalAmount += product.price * quantity;
      }
    }
    return totalAmount;
  };
  const getProductData = async () => {
    try {
      // Use the public endpoint by default
      const response = await axios.get(`${backendUrl}/api/product/public/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
    }
  };
  useEffect(() => {
    getProductData();
  }, []);

  const optimizeImage = (url, width = 480) => {
    if (!url || !url.includes('cdn.shopify.com')) return url;

    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('width', width);
      // Also set a quality and format if possible
      urlObj.searchParams.set('format', 'webp');
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  };

  const placeOrder = async (orderData) => {
    if (!token) {
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Order placed successfully");
        setCartItems({}); // Clear cart after successful order
        await getProductData(); // Refresh product data to update stock levels
        navigate('/orders'); // Redirect to orders page
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        setToken("");
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  const value = {
    products,
    setToken,
    token,
    currency,
    backendUrl,
    delivery: deliveryFee,
    updateDeliveryFee,
    cartItems,
    setCartItems,
    updateQuantity,
    getCartAmount,
    addToCart,
    getProductData,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate,
    placeOrder,
    optimizeImage,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;

