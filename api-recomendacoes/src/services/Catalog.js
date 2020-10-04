const axios = require('axios').default;

const baseUrl = 'http://localhost:3000/products';
const api = axios.create({baseURL: baseUrl})

module.exports ={
  async getCompactProduct(id) {
    try {
      const response = await api.get(`/${id}?compact=true`);
      return response.data;
    } catch (error) {
      console.log('Deu ruim')
      throw error;
    }
  },

  async getProduct(id) {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch(error) {
      throw error;
    }
  }
}



