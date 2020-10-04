const Catalog = require('../services/Catalog');
const Linx = require('../services/Linx');
const { handlingError } = require('../utils/HandlingError');

const getNewIndex = (countObject, maxProduct) => {
  countObject.count += 1;
  return maxProduct + countObject.count;
}
const getPopularItemId = (products, newIndex) => {
  return products[newIndex].recommendedProduct.id;
}

const filterNullAndUnvailables = (recommendedProductsItems) => {
  return (
    recommendedProductsItems.filter((item, index) => {
      if (item !== null) {
        if (item.status === 'AVAILABLE') {
          console.log(item._id, index)
          console.log(typeof item)
          return item;
        }
      }
    })
  );
}

const tratarNulosEUnvailable =  async (recomendedProductsIds, recommendedProductsItems, maxProduct) => {      
  let countUnvailable = {count: 0};
  let newIndex = getNewIndex(countUnvailable, maxProduct);

  for (let product of recommendedProductsItems) {
    if (product === null) {
      while(product === null && newIndex < recomendedProductsIds.length) {
        product = await Catalog.getProduct(getPopularItemId(recomendedProductsIds, newIndex)).catch(handlingError);
        console.log('hello', product !== null ?  product._id : newIndex)
        newIndex = getNewIndex(countUnvailable, maxProduct);
      }
      while(product.status !== "AVAILABLE" && newIndex < recomendedProductsIds.length) {
        product = await Catalog.getProduct(getPopularItemId(recomendedProductsIds, newIndex)).catch(handlingError);
        console.log('while status 1',product._id)
        newIndex = getNewIndex(countUnvailable, maxProduct);
      }
      console.log(recommendedProductsItems.push(product))
    } else if(product.status !== 'AVAILABLE') {
      console.log('if status', product._id);
      while(product.status !== "AVAILABLE" && newIndex < recomendedProductsIds.length) {
        product = await Catalog.getProduct(getPopularItemId(recomendedProductsIds, newIndex)).catch(handlingError);
        console.log('novo product if status', product.status, product._id)
        newIndex = getNewIndex(countUnvailable, maxProduct);
      }
      console.log(recommendedProductsItems.push(product));  
     }
  }

  return filterNullAndUnvailables(recommendedProductsItems);
}

async function getShowCases(maxProduct=10) {
  let mostPopular = await Linx.getMostPopular();
  let priceReduction = await Linx.getPriceReduction();

  if (isNaN(maxProduct)) {
    throw 'maxProduct parameter is not a number!'
  }

  if (maxProduct < 10) {
    mostPopularSliced = mostPopular.slice(0, 10);
    priceReductionSliced = priceReduction.slice(0, 10);
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

    // let countMostPopularInexistent = {count : 0};
    // let newIndex = getNewIndex(countMostPopularInexistent);
    console.log('firt ----------------')
    mostPopularItems = await tratarNulosEUnvailable(mostPopular, mostPopularItems, maxProduct);
    // mostPopularItems.map((item, index) => console.log( typeof item, index))

    console.log('second ----------------')

    priceReductionItems = await tratarNulosEUnvailable(priceReduction, priceReductionItems, maxProduct);
    // priceReductionItems.map((item, index) => console.log( typeof item, index))

    

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