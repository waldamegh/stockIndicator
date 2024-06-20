const express = require('express');
const {getAllStocks, getStockInfo, getStockPrice} = require('./stocksController');
const router = express.Router();
const updateStock = require('../../updatePriceCronJob');

router.post('/price/:symbol', getStockPrice);
router.post('/:symbol', getStockInfo);
router.post('/', getAllStocks);

module.exports = router;