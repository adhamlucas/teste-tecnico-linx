const Product = require('../models/Product');
const {
  redis,
  setWithExpire
} = require('../database/redis');

module.exports = {
  async getProduct(req, res) {
    const {
      id,
    } = req.params;

    const isCompact = req.query.compact === 'true';

    if (isNaN(id)) {
      res.status(400).json({
        error: 'id parameter need be a number',
      });
      return;
    }

    try {
      const redisKey = `${id}:${isCompact}`;
      let product = await redis.getAsync(redisKey);

      if (product === null) {
        if (isCompact) {
          const compactProduct = await Product.find({
            _id: id,
          }, {
            name: 1,
            price: 1,
            status: 1,
            categories: 1,
          });
          res.json(compactProduct);

          setWithExpire(redisKey, compactProduct);

          return;
        }
        product = await Product.findOne({
          _id: id,
        });

        setWithExpire(redisKey, product);
      } else {
        product = JSON.parse(product);
      }

      res.json(product);
    } catch (error) {
      res.send(error);
    }
  },
};