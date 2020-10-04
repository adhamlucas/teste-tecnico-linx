const axios = require('axios').default;
const { handlingError } = require('../utils/HandlingError');

url = 'https://wishlist.neemu.com/onsite/impulse-core/ranking';
const api = axios.create({baseURL: url});

module.exports = {
  async getMostPopular() {
    try {
      const response = await api.get('/mostpopular.json').catch(handlingError);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  async getPriceReduction() {
    try {
      const response = await api.get('/pricereduction.json').catch(handlingError);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}