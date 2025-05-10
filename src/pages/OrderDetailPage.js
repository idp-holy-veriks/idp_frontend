import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { OrderService } from '../services/order';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  /**
   * Obține detaliile comenzii
   */
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getOrderById(id);
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.detail || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Anulează comanda
   */
  const handleCancelOrder = async () => {
    try {
      setCancellingOrder(true);
      await OrderService.cancelOrder(id);

      setOrder(prevOrder => ({ ...prevOrder, status: 'cancelled' }));
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.detail || 'Failed to cancel order');
    } finally {
      setCancellingOrder(false);
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

  /**
   * Navigare înapoi la lista de comenzi
   */
  const goBackToOrders = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchOrderDetails}>Try Again</button>
          <button onClick={goBackToOrders} className="secondary-button">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="not-found-container">
        <h2>Order Not Found</h2>
        <p>The order you are looking for does not exist.</p>
        <button onClick={goBackToOrders} className="button">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="page-header">
        <h1>Order Details</h1>
      </div>

      <div className="order-card detail-view">
        <div className="order-header">
          <div className="order-info">
            <h2>Order #{order.id}</h2>
            <p className="order-date">Placed on {formatDate(order.order_date)}</p>
          </div>
          <div className={`order-status ${getStatusClass(order.status)}`}>
            {order.status}
          </div>
        </div>

        <div className="section">
          <h3>Items in your order</h3>
          <div className="order-items-table">
            <div className="order-items-header">
              <div className="item-name">Product</div>
              <div className="item-price">Price</div>
              <div className="item-quantity">Quantity</div>
              <div className="item-total">Total</div>
            </div>

            {order.items.map(item => (
              <div key={item.id} className="order-item-row">
                <div className="item-name">
                  <Link to={`/products/${item.product.id}`}>
                    {item.product.name}
                  </Link>
                </div>
                <div className="item-price">
                  ${item.price_at_purchase.toFixed(2)}
                </div>
                <div className="item-quantity">
                  {item.quantity}
                </div>
                <div className="item-total">
                  ${(item.price_at_purchase * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary section">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="order-shipping section">
          <h3>Shipping Information</h3>
          <p className="shipping-address">
            {order.shipping_address || 'Standard shipping to your address'}
          </p>
        </div>

        <div className="order-actions">
          <button
            onClick={goBackToOrders}
            className="back-button"
          >
            Back to Orders
          </button>

          {order.status === 'processing' && (
            <button
              className="cancel-order-btn"
              onClick={handleCancelOrder}
              disabled={cancellingOrder}
            >
              {cancellingOrder ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;