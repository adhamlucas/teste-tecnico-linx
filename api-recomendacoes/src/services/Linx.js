const axios = require('axios').default;
const {
  handlingError,
} = require('../utils/HandlingError');
const {
  redis,
  setWithExpire,
} = require('../database/redis');

url = 'https://wishlist.neemu.com/onsite/impulse-core/ranking';
const api = axios.create({
  baseURL: url,
});

module.exports = {
  async getMostPopular() {
    try {
      let mostPopularCached = await redis.getAsync('mostpopular');

      if (mostPopularCached === null) {
        const response = await api.get('/mostpopular.json').catch(handlingError);

        setWithExpire('mostpopular', response.data, 300);

        return response.data;
      }

      mostPopularCached = JSON.parse(mostPopularCached);
      return mostPopularCached;
    } catch (error) {
      throw new Error(error);
    }
  },

  async getPriceReduction() {
    try {
      let priceReductionCached = await redis.getAsync('pricereduction');

      if (priceReductionCached === null) {
        const response = await api.get('/pricereduction.json').catch(handlingError);

        setWithExpire('pricereduction', response.data, 300);

        return response.data;
      }

      priceReductionCached = JSON.parse(priceReductionCached);
      return priceReductionCached;
    } catch (error) {
      throw new Error(error);
    }
  },
};