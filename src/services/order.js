import { backendAPI } from './api';

export const OrderService = {
  /**
   * Obține toate comenzile utilizatorului curent
   * @returns {Promise} - Răspunsul de la server
   */
  async getOrders() {
    try {
      const response = await backendAPI.get('/orders/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch orders' };
    }
  },

  /**
   * Obține detaliile unei comenzi specifice
   * @param {Number} orderId - ID-ul comenzii
   * @returns {Promise} - Răspunsul de la server
   */
  async getOrderById(orderId) {
    try {
      const response = await backendAPI.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch order details' };
    }
  },

  /**
   * Creează o comandă nouă din coșul de cumpărături
   * @param {Object} orderData - Datele comenzii (adresa de livrare, metoda de plată, etc.)
   * @returns {Promise} - Răspunsul de la server
   */
  async createOrder(orderData) {
    try {
      const response = await backendAPI.post('/orders/', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to create order' };
    }
  },

  /**
   * Anulează o comandă
   * @param {Number} orderId - ID-ul comenzii
   * @returns {Promise} - Răspunsul de la server
   */
  async cancelOrder(orderId) {
    try {
      const response = await backendAPI.post(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to cancel order' };
    }
  }
};