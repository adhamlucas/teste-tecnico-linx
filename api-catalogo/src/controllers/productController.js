const Product = require('../models/Product');

module.exports = {
  async getProduct(req, res) {
    const id = req.params.id;
    const isCompact = req.query.compact;
    

    if(isNaN(id)) {
      res.status(400).json({error: "id parameter need be a number"});
      return;
    }

    try {
      if (isCompact == "true"){
        const compactProduct = await Product.find({_id: id}, {name: 1, price: 1, status: 1, categories: 1});
        res.json(compactProduct);
        return;
      }

      const product = await Product.findOne({_id: id});
      res.json(product);
    } catch(error){
      res.send(error);
    }
  }
}