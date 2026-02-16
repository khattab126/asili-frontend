import React, { useContext, useEffect, useState } from "react";
import "../style/Orders.css";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        setError("Please log in to view your orders");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
        setError(null);
      } else {
        setError(response.data.message || 'Failed to load orders');
        toast.error(response.data.message || 'Failed to load orders');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while loading orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = async (orderId, deliveryDate) => {
    try {
      // Check if within 5 days of delivery
      const deliveredDate = new Date(deliveryDate);
      const currentDate = new Date();
      const daysDifference = Math.floor((currentDate - deliveredDate) / (1000 * 60 * 60 * 24));

      if (daysDifference > 5) {
        toast.error("Refund can only be requested within 5 days of delivery");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/refund-request`,
        { orderId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Refund request submitted successfully");
        loadOrderData(); // Refresh orders
      } else {
        toast.error(response.data.message || "Failed to submit refund request");
      }
    } catch (error) {
      console.error('Refund request error:', error);
      toast.error(error.response?.data?.message || "Failed to submit refund request");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (loading) {
    return (
      <div className="orders-page">
        <h1 className="orders-title">MY ORDERS</h1>
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="orders-title">MY ORDERS</h1>
      <div className="orders-list">
        {error ? (
          <div className="no-orders">
            <p>{error}</p>
            {error.includes("log in") && (
              <button
                onClick={() => window.location.href = '/login'}
                className="custom-button"
                style={{ margin: '1rem auto' }}
              >
                Go to Login
              </button>
            )}
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found. Start shopping to place your first order!</p>
            <button
              onClick={() => window.location.href = '/'}
              className="custom-button"
              style={{ margin: '1rem auto' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <div className="order-date">
                  Order Date: {new Date(order.date).toLocaleDateString()}
                </div>
                <div className="status-badge">
                  <p className="status-dot"></p>
                  <p className="status-text">{order.status}</p>
                </div>
              </div>

              {order.items.map((item, index) => (
                <div key={index} className="item-details">
                  <img
                    src={Array.isArray(item.image) ? item.image[0] : item.image}
                    alt={item.name}
                    className="logo-img"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100";
                    }}
                  />
                  <div className="item-info">
                    <h3 className="product-name">{item.name}</h3>
                    <div className="order-details">
                      <span className="price">EGP {item.price.toFixed(2)}</span>
                      <span className="detail">Quantity: {item.quantity}</span>
                      <span className="detail">Size: {item.size}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="order-footer">
                <div className="payment-info">
                  <p>Total Amount: EGP {order.amount.toFixed(2)}</p>
                  <p>Payment Status: {
                    order.paymentMethod === 'Paymob'
                      ? 'Paid'
                      : 'Waiting for payment'
                  }</p>
                </div>
                <div className="shipping-info">
                  <p>Shipping to: {order.address.name}</p>
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                  <p>{order.address.country}</p>
                </div>
                {order.status === "Delivered" && (
                  <button
                    className="refund-button"
                    onClick={() => handleRefundRequest(order._id, order.deliveryDate)}
                    disabled={order.refundRequested || order.refundStatus}
                  >
                    {order.refundStatus ? `Refund ${order.refundStatus}` :
                      order.refundRequested ? "Refund Requested" :
                        "Request Refund"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;