const Catalog = require('../services/Catalog');
const Linx = require('../services/Linx');

module.exports = {
  async getShowCases(maxProduct=10) {
    let mostPopular = await Linx.getMostPopular();
    let priceReduction = await Linx.getPriceReduction();

    if (isNaN(maxProduct)) {
      throw 'maxProduct parameter is not a number!'
    }

    if (maxProduct < 10) {
      mostPopular = mostPopular.slice(0, 10);
      priceReduction = priceReduction.slice(0, 10);
    }

    mostPopular = mostPopular.slice(0, maxProduct);
    priceReduction = priceReduction.slice(0, maxProduct);

    console.log('popular', mostPopular[0]);
    console.log('price reduction', priceReduction.length);

    try {
      // console.log(mostPopular[0].recommendedProduct.id)
      const test = await Catalog.getProduct(mostPopular[0].recommendedProduct.id).catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data); 
          console.log(error.response.status);
          // console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          // console.log(error.request);
          throw 'Erro ao tentar obter produto da Api de Catálogo'
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        // console.log(error.config);
      });
      // const mostPopularItems = await Promise.all(mostPopular.map((item) => {
      //   Catalog.getProduct(item).catch((error) => console.log(error))
      // }))
    } catch(error) {
      throw error; 
    }



  }
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