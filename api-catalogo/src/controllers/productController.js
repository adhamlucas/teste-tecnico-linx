const Product = require('../models/Product');

module.exports = {
  async getProduct(req, res) {
    const { id } = req.query;

    try {
      const product = await Product.findOne({_id: id});
      res.json(product);
    } catch(error){
      console.error(err);
    }
  }
}