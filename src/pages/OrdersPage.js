import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OrderService } from '../services/order';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Obține toate comenzile utilizatorului
   */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.detail || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Anulează o comandă
   * @param {Number} orderId - ID-ul comenzii
   */
  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrderId(orderId);
      await OrderService.cancelOrder(orderId);

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: 'cancelled' }
            : order
        )
      );
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.detail || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  /**
   * Formatează data pentru afișare
   * @param {String} dateString - Data în format string
   * @returns {String} - Data formatată
   */
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  /**
   * Determină clasa CSS pentru statusul comenzii
   * @param {String} status - Statusul comenzii
   * @returns {String} - Clasa CSS
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      case 'shipped':
        return 'status-shipped';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchOrders}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Your Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="button">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">Placed on {formatDate(order.order_date)}</p>
                </div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
              </div>

              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-info">
                      <h4>{item.product.name}</h4>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      ${item.price_at_purchase.toFixed(2)} x {item.quantity} =
                      ${(item.price_at_purchase * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>

              <div className="order-actions">
                <Link
                  to={`/orders/${order.id}`}
                  className="view-details-btn"
                >
                  View Details
                </Link>

                {order.status === 'processing' && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingOrderId === order.id}
                  >
                    {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;