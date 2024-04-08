const express = require('express');
const {getAllStocks, getStockInfo, getStockPrice} = require('./stocksController');
const router = express.Router();

router.get('/price/:symbol', getStockPrice);
router.get('/:symbol', getStockInfo);
router.get('/', getAllStocks);

module.exports = router;