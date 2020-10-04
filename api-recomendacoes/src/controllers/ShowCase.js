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

async function getShowCases(maxProduct=10) {
  let mostPopular = await Linx.getMostPopular();
  let priceReduction = await Linx.getPriceReduction();

  if (isNaN(maxProduct)) {
    throw 'maxProduct parameter is not a number!'
  }

  if (maxProduct < 10) {
    maxProduct = 10;
  }

  mostPopularSliced = mostPopular.slice(0, maxProduct);
  priceReductionSliced = priceReduction.slice(0, maxProduct);

  try {
    let mostPopularItems = await Promise.all(mostPopularSliced.map(({recommendedProduct}) => {
      return Catalog.getProduct(recommendedProduct.id).catch(handlingError);
    })).catch(error => console.error(new Error(error)));

    let priceReductionItems = await Promise.all(priceReductionSliced.map(({recommendedProduct}) => {
      return Catalog.getProduct(recommendedProduct.id).catch(handlingError);
    })).catch(error => console.error(new Error(error)));

    console.time('tratamento')
    console.log('firt ----------------')
    console.time('popular');
    console.timeLog("popular", "Começando tratamento e request dos populares");
    mostPopularItems = await tratarNulosEUnvailable(mostPopular, mostPopularItems, maxProduct).catch((error) => new Error(error));
    console.timeEnd('popular');

    console.log('second ----------------')
    console.time('priceReduction');
    console.timeLog('priceReduction', 'começando tratamento e request dos pricereduction');
    priceReductionItems = await tratarNulosEUnvailable(priceReduction, priceReductionItems, maxProduct);
    console.timeEnd('priceReduction');
    console.timeEnd('tratamento')
    
    return ({
      mostPopular: mostPopularItems,
      priceReduction: priceReductionItems
    })

  } catch(error) {
    throw error; 
  }
}

module.exports = {
  getShowCases
}


/*
  Frontend - GET: url: http://localhost:3000/vitrines?maxProduct=10
  API recomenadção:
    - get priceReduction
      get mostPopular
      slice priceReduction[0:10] 
      slice mostPopular[0:10]
      mostPopular.map(item => getProduct(item.id));
*/