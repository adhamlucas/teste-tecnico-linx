const mongoose = require('../database') ;
const { Schema } = mongoose;

const ProductSchema = new Schema({
  _id: String,
  skus: [
    {
      _id: false,
      sku: String,
      specs: {
        voltagem: String,
        cor: String
      },
      properties: {
        name: String,
        installment: {
          count: Number,
          price: Number
        },
        images: {},
        price: Number,
        url: String,
        details: {},
        status: String,
        oldPrice: Number,
      },
      customBusiness: { }
    }
  ],
  apiKey: String,
  description: String,
  type: String,
  auditInfo: {},
  specs: {
    voltagem: [{
      id: String,
      label: String,
      properties: {}
    }],
    Cor: [{
      id: String,
      label: String,
      properties: {}
    }]
  },
  eanCode: String,
  price: String,
  details: {},
  // remoteUrl: String (todos sao null)
  categories: [
    {
      id: String,
      name: String,
      parents: [],
      _id: false
    }
  ],
  // stock: null todos os objetos tem null
  brand: String,
  customBusiness: {},
  // basePrice:null todos os objetos tem valor null para esse campo
  images:{},
  kitProducts:[],
  create: String,
  oldPrice: String,
  // published: null todos os objewtos tem valor null
  version: String,
  url: String,
  tags: [],
  // unit: null todos os objetos tem valor null
  installment: {
    count: Number,
    price: Number
  },
  name: String,
  clientLastUpdated: String,
  extraInfo: {},
  status: String,
  ungroupedId: String
}, {minimize: false, _id: false})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;