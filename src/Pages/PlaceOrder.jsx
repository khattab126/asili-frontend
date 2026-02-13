import React, { useContext, useState } from "react";
import "../style/PlaceOrder.css";
import CartTotal from '../components/CartTotal/CartTotal';
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import paymob_logo from "../assets/PayMob_icon.png";
import cod_icon from "../assets/cod_icon.png";

const PlaceOrder = () => {
  const [method, setMethod] = React.useState("COD");
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, updateDeliveryFee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(data => ({ ...data, [name]: value }));

    // Update delivery fee when governorate changes
    if (name === 'state') {
      updateDeliveryFee(value);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Check if user is logged in
    if (!token) {
      toast.error("Please login to place an order");
      navigate('/login', { state: { from: '/place-order' } });
      return;
    }

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      // Check if cart is empty
      if (orderItems.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      // Get discount code from localStorage if exists
      const savedDiscount = localStorage.getItem('cartDiscount');
      const discount = savedDiscount ? JSON.parse(savedDiscount) : null;

      let orderData = {
        address: {
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`
        },
        items: orderItems.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          image: item.image[0]
        })),
        amount: getCartAmount(),
        paymentMethod: method,
        discountCode: discount ? discount.code : null
      };

      switch (method) {
        case 'COD': {
          try {
            console.log('Sending order with token:', token);
            const response = await axios.post(
              `${backendUrl}/api/order/place`,
              orderData,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            if (response.data.success) {
              setCartItems({});
              localStorage.removeItem('cartDiscount');
              toast.success("Order placed successfully!");
              navigate('/order-confirmation');
            } else {
              toast.error(response.data.message || "Failed to place order");
            }
          } catch (error) {
            console.error("Order placement error:", error.response || error);
            if (error.response?.status === 401) {
              toast.error("Your session has expired. Please login again.");
              localStorage.removeItem("token");
              navigate('/login', { state: { from: '/place-order' } });
            } else {
              toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
            }
          }
          break;
        }
        case 'Paymob': {
          const response = await axios.post(
            backendUrl + '/api/order/paymob',
            orderData,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          if (response.data.success) {
            window.location.href = response.data.paymentUrl;
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        default:
          toast.error("Please select a payment method");
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Left Side - Delivery Form */}
      <form onSubmit={onSubmitHandler} className="layout-container">
        <div className="container">
          <div className="header">
            DELIVERY <em>INFORMATION</em>
          </div>

          {/* Name Row */}
          <div className="flex-container">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              type="text"
              placeholder="First name"
              className="input-field"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              type="text"
              placeholder="Last name"
              className="input-field"
            />
          </div>

          {/* Email */}
          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            type="email"
            placeholder="Email address"
            className="input-field full-width-field"
          />

          {/* Street */}
          <input
            required
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            type="text"
            placeholder="Street"
            className="input-field full-width-field"
          />

          {/* City/State */}
          <div className="flex-container">
            <input
              required
              type="text"
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              placeholder="City"
              className="input-field"
            />
            <select
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              className="input-field"
            >
              <option value="">Select Governorate</option>
              <option value="Cairo">Cairo</option>
              <option value="Giza">Giza</option>
              <option value="Qalyubia">Qalyubia</option>
              <option value="Helwan">Helwan</option>
              <option value="Alexandria">Alexandria</option>
              <option value="Beheira">Beheira</option>
              <option value="Gharbia">Gharbia</option>
              <option value="Kafr El Sheikh">Kafr El Sheikh</option>
              <option value="Dakahlia">Dakahlia</option>
              <option value="Damietta">Damietta</option>
              <option value="Sharqia">Sharqia</option>
              <option value="Monufia">Monufia</option>
              <option value="Faiyum">Faiyum</option>
              <option value="Beni Suef">Beni Suef</option>
              <option value="Minya">Minya</option>
              <option value="Asyut">Asyut</option>
              <option value="Sohag">Sohag</option>
              <option value="Qena">Qena</option>
              <option value="Luxor">Luxor</option>
              <option value="Aswan">Aswan</option>
              <option value="Port Said">Port Said</option>
              <option value="Ismailia">Ismailia</option>
              <option value="Suez">Suez</option>
              <option value="North Sinai">North Sinai</option>
              <option value="South Sinai">South Sinai</option>
              <option value="Red Sea">Red Sea</option>
              <option value="New Valley">New Valley</option>
              <option value="Matrouh">Matrouh</option>
            </select>
          </div>

          {/* Zipcode/Country */}
          <div className="flex-container">
            <input
              required
              type="text"
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              placeholder="Zipcode"
              className="input-field"
            />
            <input
              required
              type="text"
              placeholder="Country"
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              className="input-field"
            />
          </div>

          {/* Phone */}
          <input
            required
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            type="tel"
            placeholder="Phone"
            className="input-field full-width-field"
          />
        </div>

        {/* Right Side - Payment */}
        <div className="right-side">
          <CartTotal />

          <div className="payment-section">
            <div className="header">
              PAYMENT <em>METHOD</em>
            </div>

            <div className="payment-methods">
              <div
                className={`payment-option ${method === 'COD' ? 'selected-option' : ''}`}
                onClick={() => setMethod('COD')}
              >
                <div className="radio-container">
                  <div className={`radio-circle ${method === 'COD' ? 'selected-radio' : ''}`}></div>
                </div>
                <img src={cod_icon} alt="Cash on Delivery" className="logo-img" />
                <span>Cash on Delivery</span>
              </div>

              <div
                className={`payment-option ${method === 'Paymob' ? 'selected-option' : ''}`}
                onClick={() => setMethod('Paymob')}
              >
                <div className="radio-container">
                  <div className={`radio-circle ${method === 'Paymob' ? 'selected-radio' : ''}`}></div>
                </div>
                <img src={paymob_logo} alt="Paymob" className="logo-img" />
                <span>Paymob</span>
              </div>
            </div>

            <button type="submit" className="custom-button">
              PLACE ORDER
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
