import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BasketService } from '../services/basket';
import './BasketPage.css'

const BasketPage = () => {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);
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
   * Actualizează cantitatea unui produs din coș
   * @param {Number} basketItemId - ID-ul elementului din coș
   * @param {Number} newQuantity - Noua cantitate
   */
  const updateQuantity = async (basketItemId, newQuantity) => {
    try {
      setUpdatingItem(basketItemId);

      if (newQuantity <= 0) {
        await removeItem(basketItemId);
        return;
      }

      await BasketService.updateBasketItem(basketItemId, newQuantity);

      setBasketItems(prevItems =>
        prevItems.map(item =>
          item.id === basketItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error('Error updating basket item:', err);
      setError(err.detail || 'Failed to update basket item');
    } finally {
      setUpdatingItem(null);
    }
  };

  /**
   * Șterge un produs din coș
   * @param {Number} basketItemId - ID-ul elementului din coș
   */
  const removeItem = async (basketItemId) => {
    try {
      setUpdatingItem(basketItemId);
      await BasketService.removeBasketItem(basketItemId);

      setBasketItems(prevItems =>
        prevItems.filter(item => item.id !== basketItemId)
      );
    } catch (err) {
      console.error('Error removing basket item:', err);
      setError(err.detail || 'Failed to remove basket item');
    } finally {
      setUpdatingItem(null);
    }
  };

  /**
   * Golește coșul de cumpărături
   */
  const clearBasket = async () => {
    try {
      setLoading(true);
      await BasketService.clearBasket();
      setBasketItems([]);
    } catch (err) {
      console.error('Error clearing basket:', err);
      setError(err.detail || 'Failed to clear basket');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigare la pagina de checkout
   */
  const goToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading basket...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="basket-page">
      <div className="page-header">
        <h1>Your Shopping Basket</h1>
      </div>

      {basketItems.length === 0 ? (
        <div className="empty-basket">
          <p>Your basket is empty.</p>
          <Link to="/products" className="button">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="basket-items">
            <div className="basket-header">
              <div className="basket-product">Product</div>
              <div className="basket-price">Price</div>
              <div className="basket-quantity">Quantity</div>
              <div className="basket-total">Total</div>
              <div className="basket-actions">Actions</div>
            </div>

            {basketItems.map(item => (
              <div key={item.id} className="basket-item">
                <div className="basket-product">
                  <Link to={`/products/${item.product.id}`} className="product-link">
                    <h3>{item.product.name}</h3>
                  </Link>
                </div>
                <div className="basket-price">${item.product.price.toFixed(2)}</div>
                <div className="basket-quantity">
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={updatingItem === item.id}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updatingItem === item.id || item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="basket-total">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                <div className="basket-actions">
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    disabled={updatingItem === item.id}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="basket-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="basket-actions">
            <button onClick={clearBasket} className="clear-basket-btn">
              Clear Basket
            </button>
            <div className="action-buttons">
              <Link to="/products" className="continue-shopping-btn">
                Continue Shopping
              </Link>
              <button onClick={goToCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BasketPage;