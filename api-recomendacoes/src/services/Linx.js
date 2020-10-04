const axios = require('axios').default;

url = 'https://wishlist.neemu.com/onsite/impulse-core/ranking';
const api = axios.create({baseURL: url});

module.exports = {
  async getMostPopular() {
    try {
      const response = await api.get('/mostpopular.json');
      return response.data;
    } catch(error) {
      console.log(error);
    }
  },
  async getPriceReduction() {
    try {
      const response = await api.get('/pricereduction.json');
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}