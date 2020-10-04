const axios = require('axios').default;
const { handlingError } = require('../utils/HandlingError');

const baseUrl = 'http://localhost:3000/products';
const api = axios.create({baseURL: baseUrl})

module.exports ={
  async getCompactProduct(id) {
    try {
      const response = await api.get(`/${id}?compact=true`).catch(handlingError);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProduct(id) {
    try {
      const response = await api.get(`/${id}`).catch(handlingError);
      return response.data;
    } catch(error) {
      throw error;
    }
  }
}



