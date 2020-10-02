const Product = require('../models/Product');
const fs = require('fs');
const readline = require('readline');

let json_array = [];

const file = readline.createInterface({
  input: fs.createReadStream('script/catalog.json'),
  output: process.stdout,
  terminal: false
});

function readFileAndSave  () {
  console.log('reading .json file');

  file.on('line', (line) => {
    let document = JSON.parse(line);
    json_array.push({
      "_id": document.id,
      "skus": document.skus,
      "apiKey": document.apiKey,
      "description": document.description,
      "type": document.type,
      "auditInfo": document.auditInfo,
      "specs": document.specs,
      "price": document.price,
      "details": document.details,
      "categories": document.categories,
      "brand": document.brand,
      "customBusiness": document.customBusiness,
      "images": document.images,
      "kitProducts": document.kitProducts,
      "created": document.created,
      "oldPrice": document.oldPrice,
      "version": document.version,
      "url": document.url,
      "tags": document.tags,
      "installment": document.installment,
      "name": document.name,
      "clientLastUpdate": document.clientLastUpdate,
      "extraInfo": document.extraInfo,
      "status": document.status,
      "ungroupedId": document.ungroupedId
    });
  })

  file.on('close', async () => {
    console.log('reading .json file ok')
    console.log('Insert data in mongodb');
    try {
      const collection = await Product.insertMany(json_array);
      console.log("Saving data on mongo was a sucessful");
      process.exit(0);
    } catch(err) {
      console.error(err);
    }
  })
}

// readFileAndSave();
Product.find({status: 'AVAILABLE'}, (err, document) => {
  if (err) console.erro(err);
  console.log(document.length);
  process.exit(0);
});