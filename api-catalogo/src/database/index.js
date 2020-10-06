const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/catalog', {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose;