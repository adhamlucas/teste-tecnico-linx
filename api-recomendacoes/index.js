const Catalog = require('./src/services/Catalog');
const ShowCase = require('./src/controllers/ShowCase');

const teste = async () => {
  const data = await Catalog.getCompactProduct(12)
  console.log(data[0].categories);
}
teste();

ShowCase.getShowCases().catch((reason) => {
  console.log(reason)
})