const Catalog = require('../services/Catalog');
const Linx = require('../services/Linx');
const { handlingError } = require('../utils/HandlingError');

const getNewIndex = (countObject, maxProduct) => {
  countObject.count += 1;
  return maxProduct + countObject.count;
}

const getNewItemId = (products, newIndex) => {
  return products[newIndex].recommendedProduct.id;
}

const filterNullAndUnvailables = (recommendedProductsItems) => {
  return (
    recommendedProductsItems.filter((item) => {
      if (item !== null) {
        if (item.status === 'AVAILABLE') {
          return item;
        }
      }
    })
  );
}

const ifNullRequest = async (product, recomendedProductsIds, newIndex, countUnvailable, maxProduct) => {
  while(product === null && newIndex < recomendedProductsIds.length) {
    product = await Catalog.getProduct(getNewItemId(recomendedProductsIds, newIndex)).catch(handlingError);
    newIndex = getNewIndex(countUnvailable, maxProduct);
  }
  return product;
}

const ifUnvailableOrNullRequest = async (product, recomendedProductsIds, newIndex, countUnvailable, maxProduct) => {
  if(product === null) return product;
  while(product.status !== "AVAILABLE" && newIndex < recomendedProductsIds.length) {
    product = await Catalog.getProduct(getNewItemId(recomendedProductsIds, newIndex)).catch(handlingError);
    newIndex = getNewIndex(countUnvailable, maxProduct);
    if(product === null) {
      product = ifNullRequest(product, recomendedProductsIds, newIndex, countUnvailable, maxProduct);
    }
  }
  return product;
}

const tratarNulosEUnvailable =  async (recomendedProductsIds, recommendedProductsItems, maxProduct) => {      
  let countUnvailable = {count: 0};
  let newIndex = getNewIndex(countUnvailable, maxProduct);
  let newProducts = []

  for (let product of recommendedProductsItems) {
    if (product === null) {
      product = await ifNullRequest(product, recomendedProductsIds, newIndex, countUnvailable, maxProduct);
      product = await ifUnvailableOrNullRequest(product, recomendedProductsIds, newIndex, countUnvailable, maxProduct);
      newProducts.push(product);
    } else if(product.status !== 'AVAILABLE') {
      product = await ifUnvailableOrNullRequest(product, recomendedProductsIds, newIndex, countUnvailable, maxProduct);
      newProducts.push(product);  
     }
  }
  recommendedProductsItems = recommendedProductsItems.concat(newProducts);
  return filterNullAndUnvailables(recommendedProductsItems);
}

async function getShowCases(req, res) {
  let maxProduct = req.query.max_product;
 
  if (isNaN(maxProduct)) {
    res.status(400).send({error: 'max_product parameter is not a number!'});
    return;
  }

  maxProduct = parseInt(maxProduct, 10);
  if (maxProduct < 10) {
    maxProduct = 10;
  }

  let mostPopular = await Linx.getMostPopular();
  let priceReduction = await Linx.getPriceReduction();
  

  mostPopularSliced = mostPopular.slice(0, maxProduct);
  priceReductionSliced = priceReduction.slice(0, maxProduct);

  try {
    let mostPopularItems = await Promise.all(mostPopularSliced.map(({recommendedProduct}) => {
      return Catalog.getProduct(recommendedProduct.id).catch(handlingError);
    })).catch(error => console.error(new Error(error)));

    let priceReductionItems = await Promise.all(priceReductionSliced.map(({recommendedProduct}) => {
      return Catalog.getProduct(recommendedProduct.id).catch(handlingError);
    })).catch(error => console.error(new Error(error)));

    mostPopularItems = await tratarNulosEUnvailable(mostPopular, mostPopularItems, maxProduct).catch((error) =>{ 
      throw new Error(error);
    });
    priceReductionItems = await tratarNulosEUnvailable(priceReduction, priceReductionItems, maxProduct).catch((error) =>{ 
      throw new Error(error);
    });
    
    res.json({
      mostPopular: mostPopularItems,
      priceReduction: priceReductionItems
    })

  } catch(error) {
    res.status(500).send(error.message);
    console.error(error);
  }
}

module.exports = {
  getShowCases
}