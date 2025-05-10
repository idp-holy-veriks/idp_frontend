import { backendAPI } from './api';

export const BasketService = {
  /**
   * Obține coșul de cumpărături al utilizatorului curent
   * @returns {Promise} - Răspunsul de la server
   */
  async getBasket() {
    try {
      const response = await backendAPI.get('/basket/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch basket' };
    }
  },

  /**
   * Adaugă un produs în coșul de cumpărături
   * @param {Number} productId - ID-ul produsului
   * @param {Number} quantity - Cantitatea (implicit 1)
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
  },

  /**
   * Actualizează cantitatea unui produs din coș
   * @param {Number} basketItemId - ID-ul elementului din coș
   * @param {Number} quantity - Noua cantitate
   * @returns {Promise} - Răspunsul de la server
   */
  async updateBasketItem(basketItemId, quantity) {
    try {
      const response = await backendAPI.put(`/basket/${basketItemId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to update basket item' };
    }
  },

  /**
   * Șterge un produs din coș
   * @param {Number} basketItemId - ID-ul elementului din coș
   * @returns {Promise} - Răspunsul de la server
   */
  async removeBasketItem(basketItemId) {
    try {
      const response = await backendAPI.delete(`/basket/${basketItemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to remove basket item' };
    }
  },

  /**
   * Golește coșul de cumpărături
   * @returns {Promise} - Răspunsul de la server
   */
  async clearBasket() {
    try {
      const response = await backendAPI.delete('/basket/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to clear basket' };
    }
  }
};