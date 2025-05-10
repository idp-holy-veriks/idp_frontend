import { backendAPI } from './api';

export const ProductService = {
  /**
   * Obține lista de produse
   * @returns {Promise} - Lista de produse
   */
  async getProducts() {
    try {
      const response = await backendAPI.get('/products/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch products' };
    }
  },

  /**
   * Obține un produs după ID
   * @param {Number} id - ID-ul produsului
   * @returns {Promise} - Produsul
   */
  async getProductById(id) {
    try {
      const response = await backendAPI.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch product' };
    }
  },

  /**
   * Creează un produs nou
   * @param {Object} productData - Datele produsului
   * @returns {Promise} - Produsul creat
   */
  async createProduct(productData) {
    try {
      const response = await backendAPI.post('/products/', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to create product' };
    }
  },

  /**
   * Actualizează un produs
   * @param {Number} id - ID-ul produsului
   * @param {Object} productData - Datele produsului
   * @returns {Promise} - Produsul actualizat
   */
  async updateProduct(id, productData) {
    try {
      const response = await backendAPI.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to update product' };
    }
  },

  /**
   * Șterge un produs
   * @param {Number} id - ID-ul produsului
   * @returns {Promise} - Răspunsul de la server
   */
  async deleteProduct(id) {
    try {
      const response = await backendAPI.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to delete product' };
    }
  },

  /**
   * Adaugă un produs în coșul de cumpărături
   * @param {Number} productId - ID-ul produsului
   * @param {Number} quantity - Cantitatea
   * @returns {Promise} - Răspunsul de la server
   */
  async addToBasket(productId, quantity = 1) {
    try {
      const response = await backendAPI.post('/basket/', {
        product_id: productId,
        quantity
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to add product to basket' };
    }
  }
};