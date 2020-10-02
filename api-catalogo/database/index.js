const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose-quick-start', {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose;