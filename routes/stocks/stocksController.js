const { getAllStocksService, getStockInfoService, fetchStockPriceService, getDate } = require('./stocksService');

const getAllStocks = async (req, res) => {
    try {
        const price = (req.query.price).toLowerCase();
        const stocks = await getAllStocksService();
        if (price === 'enabled') {
            for (let i = 0; i < stocks.length; i++) {
                const stockPrice = await fetchStockPriceService(stocks[i].symbol, getDate(7), getDate(1));
                stocks[i].price = stockPrice;
            }
        }
        res.status(200).json({ stocks });
        console.log('===Get All Stocks -> Done');
    } catch (error) {
        console.log(`===Error getting stocks from Service, Error: ${error}`)
        res.status(500).json({ message: "Error: unable to get stocks from DB" });
    }
};

const getStockInfo = async (req, res) => {
    try {
        const symbol = (req.params.symbol).toUpperCase();
        console.log(`===Stock symbol is ${symbol}`);
        const stock = await getStockInfoService(symbol);
        res.status(200).json({ stock });
        console.log('===Get Stock Info -> Done');
    } catch (error) {
        console.log(`===Error getting stock info from Service, Error: ${error}`)
        res.status(500).json({ message: "Error: unable to get stock info from DB" });
    }
};

const getStockPrice = async (req, res) => {
    const symbol = (req.params.symbol).toUpperCase();
    const fromDate = req.body.fromDate || getDate(365);
    const toDate = req.body.toDate || getDate(1);
    console.log(`===Stock symbol is ${symbol}`)
    try {
        const stockPrice = await fetchStockPriceService(symbol, fromDate, toDate);
        res.status(200).json({ stockPrice });
        console.log('===Get Stock Price -> Done');
    } catch (error) {
        console.log(`===Error getting stock price from Service, Error: ${error}`)
        res.status(500).json({ message: "Error: unable to get stock price from DB" });
    }
}

module.exports = { getAllStocks, getStockInfo, getStockPrice };