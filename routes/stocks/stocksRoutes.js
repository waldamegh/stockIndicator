const express = require('express');
const {getAllStocks, getStockInfo, getStockPrice} = require('./stocksController');
const router = express.Router();

router.post('/price/:symbol', getStockPrice);
router.post('/:symbol', getStockInfo);
router.post('/', getAllStocks);

module.exports = router;