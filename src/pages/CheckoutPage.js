import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BasketService } from '../services/basket';
import { OrderService } from '../services/order';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'card'
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const totalPrice = basketItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  useEffect(() => {
    fetchBasket();
  }, []);

  /**
   * Obține coșul de cumpărături al utilizatorului
   */
  const fetchBasket = async () => {
    try {
      setLoading(true);
      const data = await BasketService.getBasket();

      if (data.length === 0) {
        // Redirectare către pagina coșului de cumpărături dacă e gol
        navigate('/basket');
        return;
      }

      setBasketItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching basket:', err);
      setError(err.detail || 'Failed to fetch basket');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gestionează schimbările în formular
   * @param {Object} e - Event-ul de change
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  /**
   * Validează formularul
   * @returns {Boolean} - true dacă formularul este valid
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    }

    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Gestionează trimiterea comenzii
   * @param {Object} e - Event-ul de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setPlacingOrder(true);

      const orderData = {
        shipping_address: `${formData.fullName}, ${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`,
        payment_method: formData.paymentMethod
      };

      const order = await OrderService.createOrder(orderData);

      navigate(`/orders/${order.id}`, {
        state: {
          isNewOrder: true,
          orderNumber: order.id
        }
      });
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.detail || 'Failed to place order. Please try again.');
      setPlacingOrder(false);
    }
  };

  /**
   * Navigare înapoi la coșul de cumpărături
   */
  const goBackToBasket = () => {
    navigate('/basket');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchBasket}>Try Again</button>
          <button onClick={goBackToBasket} className="secondary-button">
            Back to Basket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="page-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-container">
        <div className="checkout-form-container">
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={placingOrder}
              />
              {formErrors.fullName && (
                <div className="error-message">{formErrors.fullName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={placingOrder}
              />
              {formErrors.email && (
                <div className="error-message">{formErrors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={placingOrder}
              />
              {formErrors.address && (
                <div className="error-message">{formErrors.address}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={placingOrder}
                />
                {formErrors.city && (
                  <div className="error-message">{formErrors.city}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  disabled={placingOrder}
                />
                {formErrors.zipCode && (
                  <div className="error-message">{formErrors.zipCode}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={placingOrder}
              />
              {formErrors.country && (
                <div className="error-message">{formErrors.country}</div>
              )}
            </div>

            <h2>Payment Method</h2>
            <div className="payment-methods">
              <div className="payment-option">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  disabled={placingOrder}
                />
                <label htmlFor="card">Credit Card</label>
              </div>

              <div className="payment-option">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleInputChange}
                  disabled={placingOrder}
                />
                <label htmlFor="paypal">PayPal</label>
              </div>

              <div className="payment-option">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleInputChange}
                  disabled={placingOrder}
                />
                <label htmlFor="cash">Cash on Delivery</label>
              </div>
            </div>

            <div className="checkout-actions">
              <button
                type="button"
                onClick={goBackToBasket}
                className="back-button"
                disabled={placingOrder}
              >
                Back to Basket
              </button>
              <button
                type="submit"
                className="place-order-btn"
                disabled={placingOrder}
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>

        <div className="order-summary-container">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {basketItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <div className="item-price">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;