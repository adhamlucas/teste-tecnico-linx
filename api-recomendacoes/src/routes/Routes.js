const express = require('express');
const router = express.Router();

const ShowCases = require('../controllers/ShowCases');

router.get('/showcases', ShowCases.getShowCases);


module.exports = router;

