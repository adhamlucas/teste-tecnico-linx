const Catalog = require('../services/Catalog');
const Linx = require('../services/Linx');
const { handlingError } = require('../utils/HandlingError');

const filterNullAndUnvailables = (recommendedProductsItems) => (
  recommendedProductsItems.filter((item) => {
    if (item !== null && typeof item !== 'undefined') {
      if (item.status.toLocaleLowerCase() === 'available') {
        return item;
      }
    }
  })
);

async function getShowCases(req, res) {
  let maxProduct = req.query.max_product;

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(maxProduct)) {
    res.status(400).send({ error: '"max_product" parameter is not a number!' });
    return;
  }

  maxProduct = parseInt(maxProduct, 10);
  if (maxProduct < 10) {
    maxProduct = 10;
  }

  try {
    const getMostPopularPromise = Linx.getMostPopular().catch((error) => {
      throw new Error(error);
    });
    const getPriceReductionPromise = Linx.getPriceReduction().catch((error) => {
      throw new Error(error);
    });

    const [mostPopular, priceReduction] = await Promise.all([
      getMostPopularPromise,
      getPriceReductionPromise,
    ]);

    const mostPopularSliced = mostPopular.slice(0, maxProduct);
    const priceReductionSliced = priceReduction.slice(0, maxProduct);


    let mostPopularItems = await Promise.all(mostPopularSliced.map(({ recommendedProduct }) => (
      Catalog.getProduct(recommendedProduct.id).catch(handlingError))))
      .catch((error) => console.error(new Error(error)));

    let priceReductionItems = await Promise.all(priceReductionSliced
      .map(({ recommendedProduct }) => (
        Catalog.getProduct(recommendedProduct.id).catch(handlingError)))).catch((error) => console.error(new Error(error)));

    let count = 0;
    let index = maxProduct + count;
    const mostPopularItemsFiltered = await Promise.all(mostPopularItems.map((product) => {
      if (product === null && index < mostPopular.length) {
        count += 1;
        index = maxProduct + count;
        return Catalog.getProduct(mostPopular[index].recommendedProduct.id)
          .catch(handlingError);
      }
      if (product.status.toLocaleLowerCase() !== 'available' && index < mostPopular.length) {
        count += 1;
        index = maxProduct + count;
        return Catalog.getProduct(mostPopular[index].recommendedProduct.id)
          .catch(handlingError);
      }
    }));

    count = 0;
    index = maxProduct + count;
    const priceReductionItemsFiltered = await Promise.all(priceReductionItems.map((product) => {
      if (product === null && index < priceReduction.length) {
        count += 1;
        index = maxProduct + count;
        return Catalog.getProduct(priceReduction[index].recommendedProduct.id)
          .catch(handlingError);
      }
      if (product.status.toLocaleLowerCase() !== 'available' && index < priceReduction.length) {
        count += 1;
        index = maxProduct + count;
        return Catalog.getProduct(priceReduction[index].recommendedProduct.id)
          .catch(handlingError);
      }
    }));


    mostPopularItems = mostPopularItems.concat(mostPopularItemsFiltered);
    priceReductionItems = priceReductionItems.concat(priceReductionItemsFiltered);

    mostPopularItems = filterNullAndUnvailables(mostPopularItems);
    priceReductionItems = filterNullAndUnvailables(priceReductionItems);

    res.json({
      mostPopular: mostPopularItems,
      priceReduction: priceReductionItems,
    });
  } catch (error) {
    res.status(500).send(error.message);
    console.error(error);
  }
}

module.exports = {
  getShowCases,
};
