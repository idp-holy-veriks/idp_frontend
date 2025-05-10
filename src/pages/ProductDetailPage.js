import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductService } from '../services/product';
import { BasketService } from '../services/basket';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToBasket, setAddingToBasket] = useState(false);
  const [basketMessage, setBasketMessage] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  /**
   * Obține detaliile produsului
   */
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getProductById(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err.detail || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gestionează schimbarea cantității
   * @param {Number} value - Noua cantitate
   */
  const handleQuantityChange = (value) => {
    // Asigură-te că valoarea este între 1 și stock
    const newQuantity = Math.max(1, Math.min(value, product?.stock || 1));
    setQuantity(newQuantity);
  };

  /**
   * Adaugă produsul în coș
   */
  const handleAddToBasket = async () => {
    try {
      setAddingToBasket(true);
      await BasketService.addToBasket(product.id, quantity);

      setBasketMessage({
        type: 'success',
        text: `${product.name} added to basket!`
      });

      setQuantity(1);

      setTimeout(() => {
        setBasketMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error adding to basket:', err);

      setBasketMessage({
        type: 'error',
        text: err.detail || 'Failed to add product to basket'
      });

      setTimeout(() => {
        setBasketMessage(null);
      }, 3000);
    } finally {
      setAddingToBasket(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchProductDetails}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist.</p>
        <Link to="/products" className="button">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {basketMessage && (
        <div className={`basket-message ${basketMessage.type}`}>
          {basketMessage.text}
        </div>
      )}

      <div className="product-detail-container">
        <div className="product-image-container">
          <div className="product-image">
            {/* Aici ar putea fi o imagine de produs */}
            <div className="placeholder-image"></div>
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <div className="product-price">${product.price.toFixed(2)}</div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || 'No description available.'}</p>
          </div>

          <div className="product-stock">
            <span>Availability: </span>
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="add-to-basket-container">
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || addingToBasket}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.stock}
                  disabled={addingToBasket}
                />
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || addingToBasket}
                >
                  +
                </button>
              </div>

              <button
                className="add-to-basket-btn"
                onClick={handleAddToBasket}
                disabled={addingToBasket}
              >
                {addingToBasket ? 'Adding...' : 'Add to Basket'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="navigation-links">
        <Link to="/products" className="back-to-products">
          Back to Products
        </Link>
        <Link to="/basket" className="view-basket">
          View Basket
        </Link>
      </div>
    </div>
  );
};

export default ProductDetailPage;