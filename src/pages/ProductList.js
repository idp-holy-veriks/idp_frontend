import React, { useState, useEffect } from 'react';
import { ProductService } from '../services/product';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [basketMessage, setBasketMessage] = useState(null);

  useEffect(() => {
    // Încarcă produsele la montarea componentei
    fetchProducts();
  }, []);

  /**
   * Obține lista de produse de la server
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.detail || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adaugă un produs în coșul de cumpărături
   * @param {Number} productId - ID-ul produsului
   */
  const handleAddToBasket = async (productId) => {
    try {
      await ProductService.addToBasket(productId, 1);
      setBasketMessage({
        type: 'success',
        text: 'Product added to basket!'
      });

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
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchProducts}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Browse our selection of quality products.</p>
      </div>

      {basketMessage && (
        <div className={`basket-message ${basketMessage.type}`}>
          {basketMessage.text}
        </div>
      )}

      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {/* Aici ar putea fi o imagine de produs */}
                <div className="placeholder-image"></div>
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <p className="product-price">${product.price}</p>
                  <p className="product-stock">In stock: {product.stock}</p>
                </div>
                <button
                  className="add-to-basket-btn"
                  onClick={() => handleAddToBasket(product.id)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Add to Basket' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;